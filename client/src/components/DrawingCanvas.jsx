import { useEffect, useRef, useState } from "react";
import "../style/DrawingCanvas.css";

function DrawingCanvas({ drawing, setNote, setRedoStack, brushColor, brushSize, mode }) {

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentStroke, setCurrentStroke] = useState([]);

    useEffect(() => { //to show live drawing
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d"); //ctx = context

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const allStrokes = [
            ...drawing,
            { points: currentStroke }
        ];

        //Loop through every stroke
        allStrokes.forEach(stroke => {
            if (!stroke.points || stroke.points.length < 2) {
                return;
            }

            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.width;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            //Start a new path, since last line/path is already drawn, so lift the pen once
            ctx.beginPath();

            //start from this point
            //Go to first point
            ctx.moveTo(
                stroke.points[0].x,
                stroke.points[0].y
            )
            //draw to this point to this point.... till whole line/path is drawn
            stroke.points.forEach(points => {
                ctx.lineTo(points.x, points.y);
            });

            ctx.stroke();
            // console.log(allStrokes);
        });

    }, [drawing, currentStroke]);

    // this function is to store points(stroke) where mouse is down, not for drawing
    function handleMouseDown(e) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        setIsDrawing(true);

        setCurrentStroke([
            {
                x,
                y
            }
        ]);

        // console.log(currentStroke);
    }

    function handleMouseMove(e) { // continuouse mouse points/storkes sotring
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        setCurrentStroke(prev => [
            ...prev,
            { x, y }
        ]);

        // console.log(currentStroke);
    }

    function handleMouseUp() {
        setIsDrawing(false);
        const newStroke = {
            color: brushColor,
            width: brushSize,
            points: currentStroke
        };
        setNote({
            drawing: [
                ...drawing,
                newStroke
            ]
        });
        setCurrentStroke([]);
        setRedoStack([]);

    }

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="drawingCanvas"
            style={{
                border: "2px solid black",
                backgroundColor: "white",
                pointerEvents: mode === "drawing" ? "auto" : "none"
            }}

            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        />
    )
}

export default DrawingCanvas;