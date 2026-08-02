import asyncio
import json
import ollama
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

MODEL = "gemma4:cloud"

SERVER_PARAMS = StdioServerParameters(
    command="python",
    args=["-m", "mcp_server.server"],
)

def mcp_tools_to_ollama_format(mcp_tools):
    """Convert MCP tool schemas into the format ollama.chat() expects."""
    ollama_tools = []
    for tool in mcp_tools:
        ollama_tools.append({
            "type": "function",
            "function": {
                "name": tool.name,
                "description": tool.description or "",
                "parameters": tool.inputSchema,
            }
        })
    return ollama_tools

async def run_agent(user_query: str):
    async with stdio_client(SERVER_PARAMS) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # Discover available tools from the MCP server
            tools_response = await session.list_tools()
            ollama_tools = mcp_tools_to_ollama_format(tools_response.tools)

            messages = [
                {"role": "system", "content": (
                    "You are a Senior SOC (Security Operations Center) analyst assistant. "
                    "Use the available tools to investigate security logs, IPs, and payloads. "
                    "After gathering data, explain the findings clearly and give a risk assessment "
                    "with recommendations. Be concise and factual."
                )},
                {"role": "user", "content": user_query},
            ]

            # Agent loop: allow multiple rounds of tool calls
            for _ in range(5):  # safety cap on loop iterations
                response = ollama.chat(model=MODEL, messages=messages, tools=ollama_tools)
                msg = response["message"]
                messages.append(msg)

                if not msg.get("tool_calls"):
                    # No more tool calls -> final answer
                    return msg["content"]

                # Execute each requested tool call via MCP
                for tool_call in msg["tool_calls"]:
                    tool_name = tool_call["function"]["name"]
                    tool_args = tool_call["function"]["arguments"]

                    result = await session.call_tool(tool_name, tool_args)
                    result_text = result.content[0].text if result.content else "{}"

                    messages.append({
                        "role": "tool",
                        "content": result_text,
                    })

            return "Agent reached max reasoning steps without a final answer."

if __name__ == "__main__":
    query = input("Enter a SOC query: ")
    answer = asyncio.run(run_agent(query))
    print("\n=== FINAL REPORT ===")
    print(answer)