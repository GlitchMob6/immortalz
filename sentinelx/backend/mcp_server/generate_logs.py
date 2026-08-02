import json
import random
from datetime import datetime, timedelta

EVENT_TYPES = ["failed_login", "successful_login", "port_scan", "suspicious_payload", "normal_traffic"]

SUSPICIOUS_PAYLOADS = [
    "' OR '1'='1",
    "<script>alert(1)</script>",
    "; DROP TABLE users;--",
    "../../../etc/passwd",
    "UNION SELECT username,password FROM users",
]

NORMAL_PAYLOADS = ["GET /index.html", "POST /api/login", "GET /images/logo.png"]

# A small pool of "attacker" IPs that will show repeated patterns (brute force / port scans)
ATTACKER_IPS = ["185.220.101.5", "45.155.204.18", "194.180.174.22"]
NORMAL_IPS = [f"192.168.1.{i}" for i in range(10, 40)]
INTERNAL_HOSTS = [f"10.0.0.{i}" for i in range(1, 10)]
USERS = ["admin", "root", "jdoe", "svc_backup", "guest"]
PORTS = [22, 80, 443, 3389, 3306, 8080, 21]

def random_time(days_back=2):
    now = datetime.utcnow()
    delta = timedelta(
        days=random.randint(0, days_back),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
        seconds=random.randint(0, 59),
    )
    return (now - delta).isoformat() + "Z"

def generate_log():
    event_type = random.choices(
        EVENT_TYPES,
        weights=[30, 30, 15, 10, 15],  # bias toward login events + normal traffic
        k=1,
    )[0]

    is_attacker = random.random() < 0.35  # 35% of logs come from "attacker" pool
    source_ip = random.choice(ATTACKER_IPS) if is_attacker else random.choice(NORMAL_IPS)

    log = {
        "@timestamp": random_time(),
        "event_type": event_type,
        "source_ip": source_ip,
        "dest_ip": random.choice(INTERNAL_HOSTS),
        "user": random.choice(USERS),
        "port": random.choice(PORTS),
        "severity": "low",
    }

    if event_type == "failed_login":
        log["message"] = f"Failed login attempt for user {log['user']} from {source_ip}"
        log["severity"] = "medium"
    elif event_type == "successful_login":
        log["message"] = f"Successful login for user {log['user']} from {source_ip}"
    elif event_type == "port_scan":
        log["message"] = f"Port scan detected from {source_ip} targeting port {log['port']}"
        log["severity"] = "high"
    elif event_type == "suspicious_payload":
        log["payload"] = random.choice(SUSPICIOUS_PAYLOADS)
        log["message"] = f"Suspicious payload detected from {source_ip}: {log['payload']}"
        log["severity"] = "critical"
    else:
        log["payload"] = random.choice(NORMAL_PAYLOADS)
        log["message"] = f"Normal request from {source_ip}"

    return log

def generate_logs(n=500):
    return [generate_log() for _ in range(n)]

if __name__ == "__main__":
    logs = generate_logs(500)
    with open("sample_logs.json", "w") as f:
        json.dump(logs, f, indent=2)
    print(f"Generated {len(logs)} logs -> sample_logs.json")