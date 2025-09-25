const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 3008;

app.use(express.json());

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working" });
});

// Simple proxy test
app.use(
  "/api/v1/user",
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `Proxying request: ${req.method} ${req.url} -> ${proxyReq.path}`
      );
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`Proxy response: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error("Proxy error:", err.message);
      res.status(503).json({ error: "Proxy error" });
    },
  })
);

app.listen(PORT, () => {
  console.log(`Test proxy running on port ${PORT}`);
});
