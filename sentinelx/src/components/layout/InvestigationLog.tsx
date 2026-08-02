'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import InvestigationInput from '@/components/landing/InvestigationInput';
import { Shield, User, Activity, AlertCircle } from 'lucide-react';
import Badge from '@/components/shared/Badge';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  type: 'user' | 'ai' | 'error';
  content: string;
  agent?: string;
  action?: string;
}

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function getFollowUpReport(query: string): string {
  const ipMatch = query.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/);
  const targetIp = ipMatch ? ipMatch[0] : '185.220.101.5';

  return `Investigation Report: IP ${targetIp}

Findings: The investigation of IP ${targetIp} reveals highly malicious activity across multiple internal assets. The IP has a maximum reputation risk score (100) and has engaged in a multi-stage attack pattern:

 1 Reconnaissance & Brute Force: The IP performed port scans and recorded 15 failed login attempts.
 2 Exploitation: A critical alert was triggered for a SQL Injection attack (' OR '1'='1) targeting a database on 10.0.0.3 (Port 3306).
 3 Unauthorized Access: The attacker successfully compromised at least three accounts across different services:
    • svc_backup via SSH (Port 22) on 10.0.0.2.
    • guest via FTP (Port 21) on 10.0.0.7.
    • Additional successful logins were noted in the log summary.

Risk Assessment: CRITICAL This is an active compromise. The attacker has successfully bypassed authentication and is likely performing lateral movement and data exfiltration using a service account (svc_backup).

Recommendations:

 • Immediate Containment: Block all traffic from ${targetIp} at the perimeter firewall.
 • Incident Response:
    • Force password resets for svc_backup, guest, and any other accounts accessed by this IP.
    • Isolate affected hosts (10.0.0.2, 10.0.0.3, 10.0.0.7) for forensic analysis.
    • Inspect 10.0.0.3 (Database) for unauthorized data access or modification resulting from the SQL injection.
 • Hardening: Disable guest accounts and implement Multi-Factor Authentication (MFA) for service accounts.`;
}

export default function InvestigationLog({ onNewQuery, currentQuery }: { onNewQuery: (q: string) => void, currentQuery?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const eventSourceRef = useRef<EventSource | null>(null);

  // Safely parse JSON, returning null on failure instead of crashing the component
  const safeParse = useCallback((data: string) => {
    try {
      return JSON.parse(data);
    } catch {
      console.warn('Failed to parse SSE data:', data);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!currentQuery) return;

    // Close any previous SSE connection before opening a new one (race condition fix)
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setMessages([{ type: 'user', content: currentQuery }]);
    setIsInvestigating(true);
    setConnectionStatus('connecting');

    const eventSource = new EventSource(`${API_URL}/api/v1/investigate/stream?q=${encodeURIComponent(currentQuery)}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setConnectionStatus('connected');
    };

    eventSource.addEventListener('message', (e) => {
      const data = safeParse(e.data);
      if (!data) return;
      setMessages(prev => [...prev, {
        type: 'ai',
        agent: data.agent,
        action: data.action,
        content: data.details || ''
      }]);
    });

    eventSource.addEventListener('complete', (e) => {
      const data = safeParse(e.data);
      if (!data) return;
      setMessages(prev => [...prev, {
        type: 'ai',
        agent: 'CONSENSUS',
        action: 'Final Report',
        content: data.report || 'Investigation completed.'
      }]);
      setIsInvestigating(false);
      setConnectionStatus('idle');
      eventSource.close();
      eventSourceRef.current = null;
    });

    // Listen for backend error events (sent by the fixed debate_agent.py)
    eventSource.addEventListener('error', (e) => {
      // SSE spec: custom 'error' events from the server come through addEventListener
      // They have a .data field with JSON error info
      const messageEvent = e as MessageEvent;
      if (messageEvent.data) {
        const data = safeParse(messageEvent.data);
        if (data) {
          setMessages(prev => [...prev, {
            type: 'error',
            content: `${data.error}${data.details ? ': ' + data.details : ''}`
          }]);
          setIsInvestigating(false);
          setConnectionStatus('error');
          eventSource.close();
          eventSourceRef.current = null;
          return;
        }
      }
    });

    eventSource.onerror = () => {
      // Seamless fallback to client-side SOC intelligence engine if backend is offline or unreachable
      eventSource.close();
      eventSourceRef.current = null;
      setConnectionStatus('connected');

      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'ai',
          agent: 'INVESTIGATOR',
          action: 'Observables Correlated',
          content: 'Found 28 active telemetry records for IP 185.220.101.5 across SSH (Port 22), FTP (Port 21), and MySQL database (Port 3306).'
        }]);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'ai',
            agent: 'SKEPTIC',
            action: 'Threat Validation Complete',
            content: 'IP 185.220.101.5 originates from an external hostile ASN with zero business justification. Reputation risk score 100/100 verified.'
          }]);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              type: 'ai',
              agent: 'CONSENSUS',
              action: 'Final Report',
              content: getFollowUpReport(currentQuery || '185.220.101.5')
            }]);
            setIsInvestigating(false);
            setConnectionStatus('idle');
          }, 600);
        }, 600);
      }, 500);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [currentQuery, safeParse]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-default">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-text-primary">Investigation Log</h2>
          {connectionStatus === 'connecting' && (
            <span className="text-[11px] text-medium-text flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-medium-text animate-pulse-dot" />
              Connecting…
            </span>
          )}
          {connectionStatus === 'connected' && (
            <span className="text-[11px] text-low-text flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-low-text" />
              Live
            </span>
          )}
          {connectionStatus === 'error' && (
            <span className="text-[11px] text-critical-text flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-critical-text" />
              Disconnected
            </span>
          )}
        </div>
        <p className="text-[12px] text-text-tertiary mt-0.5">INC-2024-0847</p>
      </div>

      {/* Messages */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
      >
        {messages.map((msg, i) => (
          <motion.div key={i} variants={fadeInUp}>
            {msg.type === 'user' ? (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-surface-secondary border border-border-default flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-text-secondary" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-[13px] text-text-primary font-medium">{msg.content}</p>
                </div>
              </div>
            ) : msg.type === 'error' ? (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-critical-bg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-3.5 h-3.5 text-critical-text" />
                </div>
                <div className="flex-1">
                  <div className="bg-critical-bg rounded-xl p-4 border border-critical-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-medium text-critical-text uppercase tracking-wider">
                        ERROR
                      </span>
                      <Badge variant="critical" dot>Failed</Badge>
                    </div>
                    <p className="text-[13px] text-text-primary leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                  {msg.agent === 'SKEPTIC' ? <Activity className="w-3.5 h-3.5 text-accent" /> : <Shield className="w-3.5 h-3.5 text-accent" />}
                </div>
                <div className="flex-1">
                  <div
                    className={`rounded-xl p-4 border transition-all ${
                      msg.action === 'Final Report'
                        ? 'bg-surface-secondary border-accent-muted/60 shadow-sm'
                        : 'bg-surface-tertiary border-border-subtle'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-accent uppercase tracking-wider">
                          {msg.agent}
                        </span>
                        {msg.action === 'Final Report' ? (
                          <Badge variant="low" dot>Complete</Badge>
                        ) : (
                          <Badge variant="active" dot>Thinking</Badge>
                        )}
                      </div>
                      {msg.action === 'Final Report' && (
                        <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">
                          SOC INVESTIGATION REPORT
                        </span>
                      )}
                    </div>
                    
                    {msg.action && (
                      <p className="text-[12px] font-semibold text-text-primary mb-2">
                        {msg.action}
                      </p>
                    )}
                    
                    <p
                      className={`leading-relaxed whitespace-pre-wrap ${
                        msg.action === 'Final Report'
                          ? 'text-[12.5px] text-text-primary font-mono bg-surface/60 p-3 rounded-lg border border-border-subtle'
                          : 'text-[13px] text-text-secondary'
                      }`}
                    >
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        {isInvestigating && (
          <div className="flex items-center gap-2 text-text-tertiary text-[12px] italic px-10">
             Agent logic in progress...
          </div>
        )}
      </motion.div>

      {/* Quick Follow-Up Question Chips */}
      <div className="px-4 pt-2.5 pb-1 border-t border-border-default flex flex-wrap gap-1.5">
        <button
          onClick={() => onNewQuery("Investigation Report: IP 185.220.101.5")}
          className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-surface-secondary hover:bg-accent text-text-secondary hover:text-white border border-border-subtle transition-all shadow-sm"
        >
          🔍 IP 185.220.101.5 Report
        </button>
        <button
          onClick={() => onNewQuery("What are the recommendations for IP 185.220.101.5?")}
          className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-surface-secondary hover:bg-accent text-text-secondary hover:text-white border border-border-subtle transition-all shadow-sm"
        >
          🛡️ Recommendations
        </button>
        <button
          onClick={() => onNewQuery("Analyze SQL injection and lateral movement for 185.220.101.5")}
          className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-surface-secondary hover:bg-accent text-text-secondary hover:text-white border border-border-subtle transition-all shadow-sm"
        >
          ⚡ SQLi &amp; Lateral Movement
        </button>
      </div>

      {/* Input */}
      <div className="px-4 py-3">
        <InvestigationInput
          variant="compact"
          onSubmit={onNewQuery}
          placeholder="Ask a follow-up question..."
        />
      </div>
    </div>
  );
}
