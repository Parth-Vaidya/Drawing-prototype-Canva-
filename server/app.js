// app is for middleware, routes and error handling
import express from "express";
import cors from "cors";
import NotesRouter from "./routes/notes.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json({ limit: '5mb' }));

app.use("/api/notes", NotesRouter);



export default app;