from mcp_server.es_client import get_es_client, INDEX_NAME

def get_ip_details(ip_address: str):
    client = get_es_client()

    es_query = {
        "query": {"term": {"source_ip.keyword": ip_address}},
        "aggs": {
            "event_breakdown": {"terms": {"field": "event_type.keyword"}},
            "first_seen": {"min": {"field": "@timestamp"}},
            "last_seen": {"max": {"field": "@timestamp"}},
        },
        "size": 0,
    }

    response = client.search(index=INDEX_NAME, body=es_query)
    total_events = response["hits"]["total"]["value"]
    event_breakdown = {
        bucket["key"]: bucket["doc_count"]
        for bucket in response["aggregations"]["event_breakdown"]["buckets"]
    }

    failed_logins = event_breakdown.get("failed_login", 0)
    port_scans = event_breakdown.get("port_scan", 0)
    suspicious_payloads = event_breakdown.get("suspicious_payload", 0)

    reputation_score = min(100, (failed_logins * 5) + (port_scans * 15) + (suspicious_payloads * 25))

    return {
        "ip_address": ip_address,
        "total_events": total_events,
        "event_breakdown": event_breakdown,
        "first_seen": response["aggregations"]["first_seen"]["value_as_string"] if total_events else None,
        "last_seen": response["aggregations"]["last_seen"]["value_as_string"] if total_events else None,
        "reputation_score": reputation_score,
        "is_suspicious": reputation_score > 40,
    }