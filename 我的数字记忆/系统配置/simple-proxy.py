import http.server
import socketserver
import urllib.request
import urllib.parse
import json
import sys

UPSTREAM = "https://api.deepseek.com"
API_KEY = "sk-a2b2965f62014476b140929d48e80569"
PORT = 15721

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        self.proxy_request('POST')

    def do_GET(self):
        self.proxy_request('GET')

    def do_PUT(self):
        self.proxy_request('PUT')

    def do_DELETE(self):
        self.proxy_request('DELETE')

    def proxy_request(self, method):
        # Rewrite /v1/responses to /v1/chat/completions (DeepSeek doesn't support /v1/responses)
        path = self.path
        if path == "/v1/responses":
            path = "/v1/chat/completions"
            print(f"[rewrite] {self.path} → {path}")
        url = UPSTREAM + path
        req = urllib.request.Request(url, method=method)
        # Copy headers first, then override Authorization with our DeepSeek key
        for key in self.headers:
            if key.lower() not in ['host', 'connection', 'authorization']:
                req.add_header(key, self.headers[key])
        req.add_header("Authorization", "Bearer " + API_KEY)
        # Read body
        if method in ['POST', 'PUT']:
            content_len = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_len) if content_len else b''
            req.data = body
        try:
            with urllib.request.urlopen(req) as resp:
                self.send_response(resp.getcode())
                for key, value in resp.headers.items():
                    if key.lower() != 'transfer-encoding':
                        self.send_header(key, value)
                self.end_headers()
                self.wfile.write(resp.read())
        except Exception as e:
            self.send_error(502, f"Proxy error: {e}")

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), ProxyHandler) as httpd:
        print(f"Proxy running on http://127.0.0.1:{PORT} → {UPSTREAM}")
        httpd.serve_forever()
