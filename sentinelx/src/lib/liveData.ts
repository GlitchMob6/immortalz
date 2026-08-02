'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// ──────────────────────────── Types ────────────────────────────

export interface LiveStats {
  events_processed: number;
  events_24h: number;
  critical_incidents: number;
  high_alerts: number;
  medium_alerts: number;
  active_investigations: number;
  unique_source_ips: number;
  attack_events: number;
  resolved_rate: number;
  severity_breakdown: Record<string, number>;
  event_breakdown: Record<string, number>;
}

export interface LogEntry {
  '@timestamp': string;
  event_type: string;
  source_ip: string;
  dest_ip: string;
  user: string;
  port: number;
  severity: string;
  message: string;
  payload?: string;
  mitre_tactic?: string;
}

// ──────────────────────────── useStats ────────────────────────────

export function useStats(pollInterval: number = 4000) {
  const [stats, setStats] = useState<LiveStats | null>(null);

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/stats`);
        if (res.ok && active) {
          setStats(await res.json());
        }
      } catch {
        // Backend not available — keep last stats or null
      }
    };

    fetchStats();
    const timer = setInterval(fetchStats, pollInterval);
    return () => { active = false; clearInterval(timer); };
  }, [pollInterval]);

  return stats;
}

// ──────────────────────────── useRecentAttacks ────────────────────────────

export function useRecentAttacks(count: number = 5, pollInterval: number = 5000) {
  const [attacks, setAttacks] = useState<LogEntry[]>([]);

  useEffect(() => {
    let active = true;

    const fetchAttacks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/logs/attacks?count=${count}`);
        if (res.ok && active) {
          const data = await res.json();
          setAttacks(data.attacks || []);
        }
      } catch {
        // keep last data
      }
    };

    fetchAttacks();
    const timer = setInterval(fetchAttacks, pollInterval);
    return () => { active = false; clearInterval(timer); };
  }, [count, pollInterval]);

  return attacks;
}

// ──────────────────────────── useLiveLogStream ────────────────────────────

export function useLiveLogStream(maxLogs: number = 50) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(`${API_URL}/api/v1/logs/live`);
    eventSourceRef.current = es;

    es.onopen = () => setIsConnected(true);

    es.addEventListener('log', (e) => {
      try {
        const log = JSON.parse(e.data) as LogEntry;
        setLogs(prev => {
          const next = [...prev, log];
          return next.length > maxLogs ? next.slice(-maxLogs) : next;
        });
      } catch { /* ignore parse errors */ }
    });

    es.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [maxLogs]);

  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;

  return { logs, latestLog, isConnected };
}
