export type AgentRole = 'INVESTIGATOR' | 'SKEPTIC' | 'RESEARCHER' | 'CONSENSUS';

export type InvestigationStatus = 'PLANNING' | 'DEBATING' | 'CONSENSUS' | 'COMPLETE';

export interface AgentContext {
  investigationId: string;
  originalQuery: string;
  history: Message[];
  evidence: EvidenceRecord[];
}

export interface Message {
  role: AgentRole | 'USER' | 'SYSTEM';
  content: string;
  timestamp: Date;
}

export interface EvidenceRecord {
  id: string;
  source: string;
  summary: string;
  raw: any;
}

export interface AgentAction {
  nextRole?: AgentRole;
  response: string;
  toolsUsed?: string[];
  newEvidence?: EvidenceRecord[];
  isTerminal?: boolean;
}
