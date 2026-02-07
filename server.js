import dotenv from "dotenv";
import express from "express";
import next from "next";
import http from "http";
import cors from "cors";
dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 5009;
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const expressApp = express();

    // Security and Middleware
    expressApp.use(cors());
    expressApp.use(express.json({ limit: "1gb" }));
    expressApp.use(express.urlencoded({ extended: true, limit: "1gb" }));

    // Request logging middleware
    expressApp.use("/api", (req, res, next) => {
      next();
    });

    // Custom route with dynamic param
    expressApp.get("/p/:id", (req, res) => {
      const actualPage = "/post";
      const queryParams = { title: req.params.id };
      app.render(req, res, actualPage, queryParams);
    });

    // Handle everything else with Next.js
    expressApp.all("/{*any}", (req, res) => {
      return handle(req, res);
    });

    // // Error handling middleware for /api routes
    expressApp.use("/api", (err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "API error occurred!" });
    });

    // Error handling middleware
    expressApp.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Something went wrong!" });
    });

    const server = http.createServer(expressApp);

    server.listen(port, () => {
      console.log(
        `> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV
        }`
      );
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
