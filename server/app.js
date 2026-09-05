// app is for middleware, routes and error handling
import express from "express";
import cors from "cors";
import NotesRouter from "./routes/notes.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json({ limit: '5mb' }));

//api helth cheakup 
app.get("/health",(req,res)=>{
    res.status(200).json({
        status: "success",
        message: "API is working"
    });
});


app.use("/api/notes", NotesRouter);



export default app;