import express from "express";
import http from "http";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", service: "Maternity Care Portal" });
  });

  // Serve frame images from public/frames (works in both dev and prod)
  app.use('/frames', express.static(path.join(process.cwd(), 'public', 'frames'), {
    maxAge: '1d',
    immutable: true,
  }));

  const httpServer = http.createServer(app);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { server: httpServer } },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
