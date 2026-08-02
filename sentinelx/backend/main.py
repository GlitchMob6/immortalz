import os
import json
import asyncio
import uuid
import sys
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel

from log_store import store


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: seed logs + start background streamer. Shutdown: stop streamer."""
    store.seed(count=2000, days_back=2)
    streamer_task = asyncio.create_task(store.start_streaming(interval_range=(1.0, 3.0)))
    print("[SentinelX] Backend ready — logs streaming")
    yield
    store.stop_streaming()
    streamer_task.cancel()


app = FastAPI(title="SentinelX AI Backend", version="1.0.0", lifespan=lifespan)

# CORS middleware for Next.js integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InvestigateRequest(BaseModel):
    query: str


# ──────────────────────────── Investigation Endpoints ────────────────────────────

@app.post("/api/v1/investigate")
async def start_investigation(request: InvestigateRequest):
    investigation_id = str(uuid.uuid4())
    return {"investigation_id": investigation_id, "status": "PLANNING"}


@app.get("/api/v1/investigate/stream")
async def stream_investigation(request: Request, q: str = "What IPs seem malicious today?"):
    """
    Server-Sent Events endpoint.
    Streams the thoughts of the Investigator, Skeptic, and Consensus agents.
    """
    from agent.debate_agent import run_investigation_stream
    return EventSourceResponse(
        run_investigation_stream(q),
        ping=15,
    )


# ──────────────────────────── Live Data Endpoints ────────────────────────────

@app.get("/api/v1/stats")
async def get_stats():
    """Returns live dashboard statistics computed from the in-memory log store."""
    return store.get_stats()


@app.get("/api/v1/logs/recent")
async def get_recent_logs(count: int = 10, severity: str = None):
    """Returns the most recent logs, optionally filtered by minimum severity."""
    logs = store.get_recent(count=count, min_severity=severity)
    return {"logs": logs, "total": store.count}


@app.get("/api/v1/logs/attacks")
async def get_recent_attacks(count: int = 5):
    """Returns recent high/critical severity events for the dashboard."""
    attacks = store.get_recent_attacks(count=count)
    return {"attacks": attacks}


@app.get("/api/v1/logs/live")
async def live_log_stream(request: Request):
    """
    SSE endpoint that streams new logs in real-time as they're generated.
    Each event contains a single log entry.
    """
    async def event_generator():
        async for log in store.subscribe():
            if await request.is_disconnected():
                break
            yield {
                "event": "log",
                "data": json.dumps(log),
            }

    return EventSourceResponse(event_generator(), ping=10)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "logs_in_store": store.count}
