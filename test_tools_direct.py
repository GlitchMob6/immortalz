from mcp_server.tools.search_logs import search_logs
from mcp_server.tools.get_ip_details import get_ip_details
from mcp_server.tools.analyze_payload import analyze_payload

print("=== search_logs: failed logins ===")
result = search_logs(event_type="failed_login", size=5)
print(f"Total matches: {result['total_matches']}")
for r in result['results'][:3]:
    print(r['message'])

print("\n=== get_ip_details: known attacker IP ===")
result = get_ip_details("185.220.101.5")
print(result)

print("\n=== analyze_payload: SQL injection ===")
result = analyze_payload("' OR '1'='1")
print(result)

print("\n=== analyze_payload: benign ===")
result = analyze_payload("GET /index.html")
print(result)