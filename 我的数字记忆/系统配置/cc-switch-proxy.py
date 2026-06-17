import httpx
from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse
import uvicorn

app = FastAPI()
UPSTREAM = "http://127.0.0.1:11434"

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def proxy(path: str, request: Request):
    url = f"{UPSTREAM}/{path}"
    async with httpx.AsyncClient() as client:
        req = client.build_request(
            method=request.method,
            url=url,
            headers=dict(request.headers),
            content=await request.body(),
        )
        resp = await client.send(req, stream=True)
        return StreamingResponse(
            resp.aiter_bytes(),
            status_code=resp.status_code,
            headers=dict(resp.headers),
        )

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=15721, log_level="warning")
