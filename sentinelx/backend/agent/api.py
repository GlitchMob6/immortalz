from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent.agent import run_agent
import asyncio

app = FastAPI(title="SOC Agent API")

# Allow the React dev server to call this API (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for hackathon speed; tighten later if time allows
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    report: str

@app.post("/query", response_model=QueryResponse)
async def query_agent(request: QueryRequest):
    report = await run_agent(request.query)
    return QueryResponse(report=report)

@app.get("/health")
def health():
    return {"status": "ok"}