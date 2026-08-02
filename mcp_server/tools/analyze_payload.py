import re

SIGNATURES = {
    "sql_injection": [
        r"(\bOR\b|\bAND\b)\s+['\"]?\d+['\"]?\s*=\s*['\"]?\d+",
        r"UNION\s+SELECT",
        r"DROP\s+TABLE",
        r"--\s*$",
    ],
    "xss": [
        r"<script.*?>",
        r"javascript:",
        r"onerror\s*=",
    ],
    "path_traversal": [
        r"\.\./",
        r"etc/passwd",
    ],
}

def analyze_payload(payload: str):
    """
    Analyze a request payload string for known attack signatures.

    Args:
        payload: the raw payload/request string to analyze
    """
    matches = {}
    for attack_type, patterns in SIGNATURES.items():
        for pattern in patterns:
            if re.search(pattern, payload, re.IGNORECASE):
                matches.setdefault(attack_type, []).append(pattern)

    is_malicious = len(matches) > 0
    threat_types = list(matches.keys())

    return {
        "payload": payload,
        "is_malicious": is_malicious,
        "threat_types": threat_types,
        "matched_signatures": matches,
    }