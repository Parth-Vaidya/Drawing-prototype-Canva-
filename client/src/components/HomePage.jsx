import { } from "react";
import "../style/HomePage.css";

function HomePage({ clearCanvas, undo, redo, setBrushColor, setBrushSize, mode,setMode }) {

    //get req
    async function getNotes() {
        const response = await fetch("http://localhost:5000/api/notes/", { //if you want with id just add it after /${id}
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await response.text();
        console.log(data);
    }

    //post req
    async function createNote() {
        const response = await fetch("http://localhost:5000/api/notes/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Test",
                content: "Hello",
            }),
        });
        const data = await response.text();
        console.log(data);
    }

    //put req
    async function updateNote() {
        const response = await fetch("http://localhost:5000/api/notes/123", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Test",
                content: "Hello",
            }),
        });
        const data = await response.text();
        console.log(data);
    }

    // delete req
    async function deleteNotes() {
        const response = await fetch("http://localhost:5000/api/notes/", { //if you want with id just add it after /${id}
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await response.text();
        console.log(data);
    }


    return (
        <>
            <div className="mainContent">




                <div>
                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                    >
                        <option value="drawing">
                            Drawing
                        </option>

                        <option value="text">
                            Text
                        </option>
                    </select>

                    <select
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                    >
                        <option value={2}>Thin</option>
                        <option value={5}>Medium</option>
                        <option value={10}>Thick</option>
                    </select>

                    <select
                        onChange={(e) => setBrushColor(e.target.value)}
                    >
                        <option value="black">Black</option>
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                    </select>

                    <button className="Button" onClick={createNote}>Note..</button>
                    <button className="Button" onClick={clearCanvas}>Clear</button>
                    <button className="Button" onClick={undo}> Undo  </button>
                    <button className="Button" onClick={redo}> redo  </button>
                </div>

            </div>
        </>
    );
}

export default HomePage;