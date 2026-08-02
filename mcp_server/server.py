from mcp.server.fastmcp import FastMCP
from mcp_server.tools.search_logs import search_logs as _search_logs
from mcp_server.tools.get_ip_details import get_ip_details as _get_ip_details
from mcp_server.tools.analyze_payload import analyze_payload as _analyze_payload

mcp = FastMCP("SOC Agent Tools")

@mcp.tool()
def search_logs(query: str = None, event_type: str = None, source_ip: str = None, severity: str = None, size: int = 20) -> dict:
    """
    Search security logs with optional filters.
    event_type options: failed_login, successful_login, port_scan, suspicious_payload, normal_traffic
    severity options: low, medium, high, critical
    """
    return _search_logs(query, event_type, source_ip, severity, size)

@mcp.tool()
def get_ip_details(ip_address: str) -> dict:
    """
    Get aggregated activity and a computed reputation score for an IP address.
    Use this to investigate whether a specific IP looks malicious.
    """
    return _get_ip_details(ip_address)

@mcp.tool()
def analyze_payload(payload: str) -> dict:
    """
    Analyze a request payload string for known attack signatures
    (SQL injection, XSS, path traversal).
    """
    return _analyze_payload(payload)

if __name__ == "__main__":
    mcp.run()