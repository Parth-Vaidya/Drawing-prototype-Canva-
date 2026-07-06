import express from "express";
import cors from "cors";


const NotesRouter = require("./routes/notes.js");
const PORT = 5000;
const app = express();


app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json({limit: '5mb'}));

app.use("/api/notes",NotesRouter);



app.listen(PORT,()=>{
    console.log("Server is running on port 5000");
});