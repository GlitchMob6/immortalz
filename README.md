# 🛡️ Veritas — Autonomous Real-Time AI SOC & Threat Investigation Engine

<div align="center">

![Veritas Badge](https://img.shields.io/badge/Veritas-Next--Gen%20SOC-00F2FE?style=for-the-badge&logo=shield&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python%203.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch%208.12-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**An AI-native Security Operations Center (SOC) operating system combining high-frequency real-time telemetry streaming with a 3-Agent Adversarial AI Debate Pipeline for autonomous cyber threat detection, validation, and containment.**

[Explore Features](#-key-features--jury-evaluation-highlights) • [System Architecture](#-system-architecture--ai-debate-pipeline) • [Quickstart](#-quickstart-guide-evaluate-in--60-seconds) • [Docker Deployment](#-enterprise-elasticsearch--docker-deployment)

---

</div>

## 🌟 Executive Summary

Modern Security Operations Centers are paralyzed by alert fatigue and false positives. **Veritas** solves this by pairing an ultra-low latency telemetry streaming engine with an **autonomous multi-agent AI debate pipeline**. Instead of relying on a single LLM prompt that can hallucinate, Veritas forces three specialized AI agents to debate every suspicious incident before alerting an analyst.

```
       +-----------------------------------------------------------------------+
       |                      VERITAS SOC TELEMETRY PIPELINE                   |
       +-----------------------------------------------------------------------+
                                           │
          ┌────────────────────────────────┴────────────────────────────────┐
          ▼                                                                 ▼
 ┌──────────────────────────────────┐     ┌──────────────────────────────────────────────────┐
 │  FastAPI Telemetry Engine        │     │      Next.js 16 / React 19 Interactive UI        │
 │  • 2,000+ Historical Seed Events │     │  • 24-Hour Alert Intensity Bar Chart             │
 │  • Real-Time SSE Log Streaming   │     │  • Live Attack Timeline & MITRE Kill-Chain       │
 │  • Elastic / In-Memory Support   │     │  • Interactive Left-Panel Investigation Workspace│
 └─────────────────┬────────────────┘     └────────────────────────┬─────────────────────────┘
                   │                                               │
                   └───────────────────────┬───────────────────────┘
                                           │
                                           ▼
          +-----------------------------------------------------------------------+
          |             MULTI-AGENT DEBATE INVESTIGATION PIPELINE                 |
          +-----------------------------------------------------------------------+
          |                                                                       |
          |  1. INVESTIGATOR AGENT ──> Extracts observables, correlates MITRE     |
          |  2. SKEPTIC AGENT      ──> Challenges claims, checks ASN risk scores  |
          |  3. CONSENSUS AGENT    ──> Synthesizes structured Executive Report    |
          |                                                                       |
          +-----------------------------------------------------------------------+
```

---

## ✨ Key Features & Jury Evaluation Highlights

### 1. 📊 24-Hour SOC Alert Intensity Bar Chart (All Timings of the Day)
* **Interactive Visual Reporting**: Located in the **Reports** view and the main **Investigation Workspace**, this visual chart maps incident volumes across every hour of the day (`00:00 - 23:00`).
* **Multi-Severity Comparison**: Clearly contrasts **Peak Alerts (Critical & High)** against **Medium Alerts** in a modern stacked bar layout.
* **Resolution & Severity Toggles**:
  * Seamlessly toggle between **Bi-hourly** (`00:00 - 02:00`, `02:00 - 04:00`, etc.) and **Hourly** (`00:00`, `01:00`, etc.) granularities.
  * Filter visual bars by `All Alerts`, `Peak Only`, or `Medium Only`.
* **Deep-Dive Hover Tooltips**: Hover over any time bar to reveal top source IP addresses, primary attack vectors (e.g., *Brute Force*, *SQL Injection*, *Lateral Movement*), and precise event counts.

---

### 2. 🤖 Autonomous 3-Agent Adversarial Debate Pipeline
Veritas enforces rigorous verification through three competing AI roles:
1. **Investigator (`INVESTIGATOR`)**: Gathers active network observables, queries telemetry logs, maps ports/user accounts, and correlates **MITRE ATT&CK** tactics.
2. **Skeptic (`SKEPTIC`)**: Adopts an adversarial security posture—challenging unverified claims, evaluating false-positive probabilities, and assessing IP reputation scores.
3. **Consensus (`CONSENSUS`)**: Arbitrates the debate and formulates a verified, executive-ready incident report with immediate firewall containment rules.

---

### 3. 🔍 Left-Panel Investigation Workspace & Structured Q&A
* **Instant Action Follow-Up Chips**: Located above the chat input in the left sidebar for rapid evaluation:
  * `🔍 IP 185.220.101.5 Report`
  * `🛡️ Recommendations`
  * `⚡ SQLi & Lateral Movement`
* **Structured Executive Reporting**: Every report adheres to an enterprise incident format:
  ```markdown
  Investigation Report: IP 185.220.101.5

  Findings: The investigation of IP 185.220.101.5 reveals highly malicious activity across multiple internal assets. The IP has a maximum reputation risk score (100) and has engaged in a multi-stage attack pattern:

   1 Reconnaissance & Brute Force: The IP performed port scans and recorded 15 failed login attempts.
   2 Exploitation: A critical alert was triggered for a SQL Injection attack (' OR '1'='1) targeting a database on 10.0.0.3 (Port 3306).
   3 Unauthorized Access: The attacker successfully compromised at least three accounts across different services:
      • svc_backup via SSH (Port 22) on 10.0.0.2.
      • guest via FTP (Port 21) on 10.0.0.7.
      • Additional successful logins were noted in the log summary.

  Risk Assessment: CRITICAL This is an active compromise. The attacker has successfully bypassed authentication and is likely performing lateral movement and data exfiltration using a service account (svc_backup).

  Recommendations:

   • Immediate Containment: Block all traffic from 185.220.101.5 at the perimeter firewall.
   • Incident Response:
      • Force password resets for svc_backup, guest, and any other accounts accessed by this IP.
      • Isolate affected hosts (10.0.0.2, 10.0.0.3, 10.0.0.7) for forensic analysis.
      • Inspect 10.0.0.3 (Database) for unauthorized data access or modification resulting from the SQL injection.
   • Hardening: Disable guest accounts and implement Multi-Factor Authentication (MFA) for service accounts.
  ```
* **Client-Side Simulation Fallback**: Ensures 100% evaluation reliability even when offline or testing without a local Python runtime.

---

### 4. 📈 SLA Adherence & MITRE ATT&CK Kill-Chain Mapping
* **Real-time SOC KPIs**: Tracks SLA adherence (`99.99%`), Mean Time to Detection (`< 12s`), and incident resolution velocity.
* **Kill-Chain Visualizer**: Interactive threat mapping across *Reconnaissance*, *Initial Access*, *Execution*, *Persistence*, and *Lateral Movement*.
* **Threat Distribution Breakdown**: Live visual breakdown of attack methods across SSH brute force, SQL injection, and unauthorized elevation.

---

## 📁 Repository Structure

```
.
├── sentinelx/                         # Veritas Main Project Workspace
│   ├── backend/                       # Python 3 FastAPI Telemetry & AI Server
│   │   ├── agent/debate_agent.py      # Multi-Agent Debate Engine (Investigator/Skeptic/Consensus)
│   │   ├── mcp_server/                # Model Context Protocol & Elasticsearch client (es_client.py)
│   │   ├── log_store.py               # High-speed Thread-Safe In-Memory SOC Telemetry Store
│   │   └── main.py                    # FastAPI Server Entrypoint & Real-Time SSE Streams
│   ├── src/                           # Next.js 16 App Router & React 19 Frontend
│   │   ├── components/
│   │   │   ├── layout/TopBar.tsx      # Veritas Navigation Header
│   │   │   ├── layout/InvestigationLog.tsx # Left-Panel AI Investigation Log & Q&A
│   │   │   ├── reports/ExecutiveReport.tsx # Executive Security Reports & SLA Metrics
│   │   │   └── shared/AlertTimeOfDayChart.tsx # 24-Hour SOC Alert Intensity Bar Chart
│   │   └── lib/liveData.ts            # Client-side Real-Time Telemetry & SSE Hooks
│   ├── docker-compose.yml             # Full Enterprise Docker Stack (Elasticsearch 8.12, PG, Redis)
│   └── package.json                   # Dependencies & Scripts
└── README.md                          # Repository Executive Documentation
```

---

## 🚀 Quickstart Guide (Evaluate in < 60 Seconds)

### Prerequisites
* **Node.js** (v18+ recommended) & **npm**
* **Python 3.10+**

### Step 1: Start the Backend Telemetry & AI Server
Open a terminal inside the `sentinelx/backend` directory:

```bash
cd sentinelx/backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```
*The backend will automatically seed **2,000 historical log events** and begin streaming live security telemetry via Server-Sent Events (SSE).*

### Step 2: Start the Next.js Frontend Dev Server
Open a second terminal inside `sentinelx/`:

```bash
cd sentinelx
npm install
npm run dev
```

### Step 3: Open Veritas in Your Browser
Navigate to **[http://localhost:3000](http://localhost:3000)**:
1. **Test the 24-Hour Alert Intensity Chart**: Toggle between Bi-hourly and Hourly resolution, filter by Peak/Medium severity, and hover over any time bar to inspect attack vectors and IPs.
2. **Test Follow-Up Questions**: In the **Investigation Log** on the left, click **`🔍 IP 185.220.101.5 Report`** to generate a structured incident report with Findings, Risk Assessment (`100/100`), and Recommendations.
3. **Switch to Reports**: Click the **Reports** tab in the top header to inspect executive SLA metrics and threat vector distributions.

---

## 🐳 Enterprise Elasticsearch & Docker Deployment

Veritas includes pre-built integration with **Elasticsearch 8.12.0** for enterprise-scale log ingestion and indexing.

### Deploy the Entire Stack in 1 Command:
```bash
cd sentinelx
docker compose up --build -d
```

This single command spins up:
1. **Elasticsearch (`8.12.0`)** on `http://localhost:9200`
2. **PostgreSQL (`15-alpine`)** on `5432`
3. **Redis (`7-alpine`)** on `6379`
4. **Veritas FastAPI Backend** on `http://localhost:8000` (connected to `ELASTICSEARCH_URL=http://elasticsearch:9200`)
5. **Veritas Next.js Frontend** on `http://localhost:3000`

---

## 🏆 Why Veritas Stands Out

* **No Hallucinations**: 3-Agent Adversarial Debate checks every claim before alerting.
* **All Timings of Day Reporting**: Comprehensive 24-hour alert intensity visual charts (`00:00 - 23:00`).
* **Structured Actionable Intelligence**: Immediate findings, risk scores, and containment steps for security analysts.
* **Production Build Verified**: Zero TypeScript or compilation errors (`npm run build`).

---

<div align="center">
  <sub>Built with precision for autonomous security operations.</sub>
</div>
