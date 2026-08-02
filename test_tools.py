import ollama

response = ollama.chat(
    model='gemma4:cloud',
    messages=[{'role': 'user', 'content': 'What is the risk level of IP 192.168.1.50?'}],
    tools=[{
        'type': 'function',
        'function': {
            'name': 'get_ip_details',
            'description': 'Get reputation and details for an IP address',
            'parameters': {
                'type': 'object',
                'properties': {
                    'ip_address': {'type': 'string', 'description': 'The IP address to look up'}
                },
                'required': ['ip_address']
            }
        }
    }]
)

print(response['message'])