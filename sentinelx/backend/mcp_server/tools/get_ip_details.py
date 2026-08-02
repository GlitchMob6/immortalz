"""Get IP reputation details using the in-memory log store (no Elasticsearch dependency)."""
import sys
import os

# Add backend root to path so we can import log_store
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from log_store import store


def get_ip_details(ip_address: str):
    """
    Get aggregated activity and a computed reputation score for an IP address.
    Use this to investigate whether a specific IP looks malicious.

    Args:
        ip_address: the IP to look up
    """
    return store.get_ip_details(ip_address)