// ─── Mock Data for SentinelX ───
// All data is simulated. No backend required.

export const stats = {
  eventsProcessed: 742321,
  criticalIncidents: 6,
  mediumAlerts: 18,
  activeInvestigations: 2,
  resolvedRate: 99.2,
};

export const suggestedPrompts = [
  {
    icon: 'Shield',
    text: 'Investigation Report: IP 185.220.101.5',
  },
  {
    icon: 'AlertTriangle',
    text: "Investigate today's highest risk incident",
  },
  {
    icon: 'Globe',
    text: 'Show suspicious IPs from the last 24 hours',
  },
  {
    icon: 'FileText',
    text: 'Generate executive security report',
  },
  {
    icon: 'Shield',
    text: "Explain today's ransomware alert",
  },
  {
    icon: 'TrendingUp',
    text: "Compare today's attacks with yesterday",
  },
];

export const recentInvestigations = [
  {
    id: 'INV-2024-0847',
    title: 'Brute Force Attack → Lateral Movement',
    time: '2h ago',
    status: 'resolved' as const,
    severity: 'critical' as const,
  },
  {
    id: 'INV-2024-0846',
    title: 'Ransomware Alert — Endpoint Analysis',
    time: '5h ago',
    status: 'active' as const,
    severity: 'high' as const,
  },
  {
    id: 'INV-2024-0845',
    title: 'Suspicious DNS Exfiltration Attempt',
    time: '1d ago',
    status: 'resolved' as const,
    severity: 'medium' as const,
  },
];

export type PipelineStepStatus = 'pending' | 'active' | 'complete';

export interface PipelineStepData {
  label: string;
  status: PipelineStepStatus;
  duration?: string;
}

export const investigationPipeline: PipelineStepData[] = [
  { label: 'Understanding Request', status: 'complete', duration: '0.3s' },
  { label: 'Planning Investigation', status: 'complete', duration: '0.8s' },
  { label: 'Generating Elasticsearch Query', status: 'complete', duration: '1.2s' },
  { label: 'Searching Security Logs', status: 'active' },
  { label: 'Correlating Evidence', status: 'pending' },
  { label: 'Predicting Attack Path', status: 'pending' },
  { label: 'Writing Executive Report', status: 'pending' },
];

export const incidentSummary = {
  id: 'INC-2024-0847',
  title: 'Credential Theft via Password Spraying → Lateral Movement',
  severity: 'critical' as const,
  confidence: 94,
  status: 'active' as const,
  attackVector: 'External → Credential Access → Lateral Movement',
  affectedAssets: 14,
  firstSeen: '09:20 UTC',
  lastActivity: '09:37 UTC',
  description:
    'A coordinated password spraying attack was detected targeting Azure AD accounts. The attacker successfully compromised 3 accounts and initiated lateral movement across the internal network, culminating in an attempted data exfiltration via DNS tunneling.',
};

export interface TimelineEventData {
  time: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  details?: string;
  source?: string;
}

export const attackTimeline: TimelineEventData[] = [
  {
    time: '09:20',
    title: 'Successful Login',
    description: 'Account jsmith@corp.io authenticated from 185.234.72.19 (Tor exit node)',
    severity: 'medium',
    details: 'First successful login after 847 failed attempts across 12 accounts. Geolocation: Eastern Europe.',
    source: 'Azure AD Logs',
  },
  {
    time: '09:23',
    title: 'PowerShell Execution',
    description: 'Encoded PowerShell command executed on WORKSTATION-042',
    severity: 'high',
    details: 'Base64-encoded command downloading secondary payload from C2 server at 91.234.56.78.',
    source: 'Sysmon Event ID 1',
  },
  {
    time: '09:25',
    title: 'Defense Evasion',
    description: 'Windows Defender real-time protection disabled',
    severity: 'high',
    details: 'Set-MpPreference -DisableRealtimeMonitoring $true executed via elevated PowerShell.',
    source: 'Windows Event Log',
  },
  {
    time: '09:28',
    title: 'Credential Dumping',
    description: 'Mimikatz variant detected extracting LSASS credentials',
    severity: 'critical',
    details: 'LSASS.exe memory was accessed by unsigned process. 23 credential pairs extracted.',
    source: 'EDR Telemetry',
  },
  {
    time: '09:32',
    title: 'Lateral Movement',
    description: 'RDP sessions initiated to 4 internal servers using harvested credentials',
    severity: 'critical',
    details: 'Targets: DC01, FILESVR-02, SQL-PROD-01, BACKUP-01. Using admin credentials from jsmith.',
    source: 'Network Flow Logs',
  },
  {
    time: '09:37',
    title: 'Data Exfiltration Attempt',
    description: 'DNS tunneling detected — 2.3 GB of encoded data transmitted',
    severity: 'critical',
    details: 'Subdomain encoding detected on queries to xf7k2.evil.io. Estimated 2.3 GB of compressed data.',
    source: 'DNS Query Logs',
  },
];

export interface MitreTactic {
  id: string;
  name: string;
  techniques: string[];
  detected: boolean;
}

export const mitreTactics: MitreTactic[] = [
  {
    id: 'TA0043',
    name: 'Reconnaissance',
    techniques: ['Active Scanning', 'Gather Victim Identity'],
    detected: true,
  },
  {
    id: 'TA0001',
    name: 'Initial Access',
    techniques: ['Valid Accounts', 'Brute Force'],
    detected: true,
  },
  {
    id: 'TA0002',
    name: 'Execution',
    techniques: ['PowerShell', 'Command Line Interface'],
    detected: true,
  },
  {
    id: 'TA0003',
    name: 'Persistence',
    techniques: ['Registry Run Keys', 'Scheduled Task'],
    detected: false,
  },
  {
    id: 'TA0004',
    name: 'Privilege Escalation',
    techniques: ['Access Token Manipulation'],
    detected: true,
  },
  {
    id: 'TA0005',
    name: 'Defense Evasion',
    techniques: ['Disable Security Tools', 'Obfuscated Files'],
    detected: true,
  },
  {
    id: 'TA0006',
    name: 'Credential Access',
    techniques: ['OS Credential Dumping', 'Brute Force'],
    detected: true,
  },
  {
    id: 'TA0008',
    name: 'Lateral Movement',
    techniques: ['Remote Desktop Protocol', 'SMB/Windows Admin Shares'],
    detected: true,
  },
  {
    id: 'TA0010',
    name: 'Exfiltration',
    techniques: ['Exfiltration Over Alternative Protocol (DNS)'],
    detected: true,
  },
  {
    id: 'TA0040',
    name: 'Impact',
    techniques: ['Data Encrypted for Impact'],
    detected: false,
  },
];

export interface AgentData {
  name: string;
  role: string;
  color: string;
  task: string;
  progress: number;
  confidence: number;
  latestFinding: string;
  status: 'active' | 'idle' | 'complete';
}

export const agents: AgentData[] = [
  {
    name: 'Commander',
    role: 'Investigation Coordinator',
    color: 'var(--agent-commander)',
    task: 'Coordinating investigation across all agents',
    progress: 85,
    confidence: 94,
    latestFinding: 'Multi-stage attack confirmed — 6 kill chain phases detected',
    status: 'active',
  },
  {
    name: 'Threat Hunter',
    role: 'Threat Detection & Search',
    color: 'var(--agent-hunter)',
    task: 'Searching failed login events across Azure AD',
    progress: 92,
    confidence: 88,
    latestFinding: 'Password spraying detected — 847 failed attempts from single IP range',
    status: 'active',
  },
  {
    name: 'Malware Analyst',
    role: 'Malware & Payload Analysis',
    color: 'var(--agent-malware)',
    task: 'Analyzing PowerShell payload signatures',
    progress: 67,
    confidence: 82,
    latestFinding: 'Mimikatz variant identified — hash match 92% confidence',
    status: 'active',
  },
  {
    name: 'Network Investigator',
    role: 'Network Forensics',
    color: 'var(--agent-network)',
    task: 'Tracing lateral movement paths via RDP logs',
    progress: 78,
    confidence: 91,
    latestFinding: 'DNS tunneling to xf7k2.evil.io confirmed — 2.3 GB exfiltrated',
    status: 'active',
  },
  {
    name: 'Risk Predictor',
    role: 'Threat Modeling & Prediction',
    color: 'var(--agent-risk)',
    task: 'Modeling attack progression probability',
    progress: 55,
    confidence: 76,
    latestFinding: 'High probability of ransomware deployment within 2 hours',
    status: 'active',
  },
  {
    name: 'Report Writer',
    role: 'Report Generation',
    color: 'var(--agent-writer)',
    task: 'Awaiting investigation completion',
    progress: 10,
    confidence: 0,
    latestFinding: 'Draft outline prepared — awaiting final evidence correlation',
    status: 'idle',
  },
];

export const evidenceItems = [
  {
    type: 'Authentication Logs',
    confidence: 96,
    logsConsulted: 12847,
    reasoning: 'Pattern analysis of 847 failed login attempts from IP range 185.234.72.0/24 within a 15-minute window indicates automated password spraying using a credential list.',
    query: `GET /azure-ad-logs/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "event.action": "UserLoginFailed" } },
        { "range": { "@timestamp": { "gte": "now-24h" } } }
      ],
      "filter": [
        { "range": { "source.ip": { "gte": "185.234.72.0", "lte": "185.234.72.255" } } }
      ]
    }
  },
  "aggs": {
    "by_account": { "terms": { "field": "user.name", "size": 50 } }
  }
}`,
  },
  {
    type: 'Process Execution Logs',
    confidence: 91,
    logsConsulted: 3429,
    reasoning: 'Sysmon Event ID 1 captured encoded PowerShell execution immediately after successful authentication. Decoded payload contains download cradle for secondary implant.',
    query: `GET /sysmon-*/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "event.code": 1 } },
        { "wildcard": { "process.command_line": "*-enc*" } },
        { "match": { "host.name": "WORKSTATION-042" } }
      ]
    }
  }
}`,
  },
  {
    type: 'Network Flow Data',
    confidence: 89,
    logsConsulted: 8921,
    reasoning: 'DNS query analysis reveals high-frequency subdomain lookups to xf7k2.evil.io with Base32-encoded payloads in the subdomain field, consistent with DNS tunneling exfiltration.',
    query: `GET /dns-logs/_search
{
  "query": {
    "bool": {
      "must": [
        { "wildcard": { "dns.question.name": "*.xf7k2.evil.io" } },
        { "range": { "@timestamp": { "gte": "now-6h" } } }
      ]
    }
  },
  "sort": [{ "@timestamp": "asc" }],
  "size": 500
}`,
  },
];

export const threatMapData = [
  { from: { lat: 48.8566, lng: 2.3522, label: 'Paris' }, to: { lat: 40.7128, lng: -74.006, label: 'New York' } },
  { from: { lat: 55.7558, lng: 37.6176, label: 'Moscow' }, to: { lat: 37.7749, lng: -122.4194, label: 'San Francisco' } },
  { from: { lat: 31.2304, lng: 121.4737, label: 'Shanghai' }, to: { lat: 51.5074, lng: -0.1278, label: 'London' } },
  { from: { lat: 35.6762, lng: 139.6503, label: 'Tokyo' }, to: { lat: 34.0522, lng: -118.2437, label: 'Los Angeles' } },
];

export const recommendations = [
  {
    priority: 'critical' as const,
    title: 'Isolate Compromised Endpoints',
    description: 'Immediately isolate WORKSTATION-042, DC01, FILESVR-02, SQL-PROD-01, and BACKUP-01 from the network.',
    action: 'Initiate network isolation',
  },
  {
    priority: 'critical' as const,
    title: 'Reset Compromised Credentials',
    description: 'Force password reset for all 23 compromised accounts and revoke active sessions.',
    action: 'Reset credentials',
  },
  {
    priority: 'high' as const,
    title: 'Block Malicious Infrastructure',
    description: 'Block IP range 185.234.72.0/24 and domain xf7k2.evil.io at perimeter firewall and DNS.',
    action: 'Update firewall rules',
  },
  {
    priority: 'high' as const,
    title: 'Enable MFA for All Admin Accounts',
    description: 'Enforce multi-factor authentication on all privileged accounts to prevent credential reuse.',
    action: 'Configure MFA policy',
  },
  {
    priority: 'medium' as const,
    title: 'Deploy Enhanced Monitoring',
    description: 'Increase logging verbosity on affected servers and enable PowerShell script block logging.',
    action: 'Update monitoring config',
  },
];

export const queryVisualization = {
  naturalLanguage: "Investigate today's highest risk incident",
  understanding: 'User wants to find the most critical security incident from the last 24 hours, analyze its attack chain, and provide a comprehensive investigation report.',
  elasticsearchQuery: `GET /security-events-*/_search
{
  "query": {
    "bool": {
      "must": [
        { "range": { "@timestamp": { "gte": "now-24h" } } },
        { "range": { "event.risk_score": { "gte": 80 } } }
      ]
    }
  },
  "sort": [{ "event.risk_score": "desc" }],
  "size": 1
}`,
  retrievedCount: 1,
  reasoning: 'The highest risk event (score: 98) is a multi-stage attack starting with password spraying and escalating through credential theft, lateral movement, and data exfiltration. Cross-correlating with 24,891 related events to build the full kill chain.',
};

export const commandPaletteItems = [
  { type: 'investigation' as const, label: 'Brute Force Investigation', id: 'INV-2024-0847', shortcut: '' },
  { type: 'investigation' as const, label: 'Ransomware Alert Analysis', id: 'INV-2024-0846', shortcut: '' },
  { type: 'action' as const, label: 'Start New Investigation', id: 'new', shortcut: '⌘N' },
  { type: 'action' as const, label: 'Generate Executive Report', id: 'report', shortcut: '⌘R' },
  { type: 'action' as const, label: 'View All Incidents', id: 'incidents', shortcut: '⌘I' },
  { type: 'action' as const, label: 'View Threat Map', id: 'map', shortcut: '⌘M' },
  { type: 'action' as const, label: 'Show Investigation History', id: 'history', shortcut: '⌘H' },
];
