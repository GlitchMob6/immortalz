"""Search security logs using the in-memory log store (no Elasticsearch dependency)."""
import sys
import os

# Add backend root to path so we can import log_store
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from log_store import store


def search_logs(query: str = None, event_type: str = None, source_ip: str = None, severity: str = None, size: int = 20):
    """
    Search security logs with optional filters.

    Args:
        query: free-text search across the 'message' field
        event_type: filter by event type (failed_login, port_scan, suspicious_payload, etc.)
        source_ip: filter by source IP address
        severity: filter by severity (low, medium, high, critical)
        size: max number of results to return
    """
    return store.search(query=query, event_type=event_type, source_ip=source_ip, severity=severity, size=size)