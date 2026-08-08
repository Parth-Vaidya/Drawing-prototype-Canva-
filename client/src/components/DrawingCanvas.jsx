import { useEffect, useRef, useState } from "react";
import "../style/DrawingCanvas.css";

function DrawingCanvas({
    drawing,
    setNote,
    setRedoStack,
    brushColor,
    brushSize,
    mode
}) {

    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [currentStroke, setCurrentStroke] = useState([]);

    const canvasSizeRef = useRef({
        width: 0,
        height: 0
    });


    /*
     * Resize canvas according to the available
     * NoteSheet size.
     */
    useEffect(() => {

        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) return;

        function resizeCanvas() {

            const rect = container.getBoundingClientRect();

            const width = Math.floor(rect.width);
            const height = Math.floor(rect.height);

            if (width <= 0 || height <= 0) return;

            canvas.width = width;
            canvas.height = height;

            canvasSizeRef.current = {
                width,
                height
            };

            redrawCanvas();
        }

        const observer = new ResizeObserver(resizeCanvas);

        observer.observe(container);

        resizeCanvas();

        return () => {
            observer.disconnect();
        };

    }, []);


    /*
     * Draw saved strokes + current stroke
     */
    function redrawCanvas() {

        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        // Clear the previous canvas before drawing everything again
        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Draw saved strokes as well as the stroke currently being drawn
        const allStrokes = [
            ...drawing,
            {
                points: currentStroke,
                color: brushColor,
                width: brushSize
            }
        ];

        // Loop through every stroke
        allStrokes.forEach(stroke => {

            // Ignore empty strokes or strokes with only one point
            if (
                !stroke.points ||
                stroke.points.length < 2
            ) {
                return;
            }

            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.width;

            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // Start a new path, since the previous line/path
            // is already drawn, so lift the pen once
            ctx.beginPath();

            // Start from the first point
            const firstPoint = stroke.points[0];

            /*
             * Points are stored as normalized values (0 to 1),
             * so convert them back to the current canvas size.
             */
            ctx.moveTo(
                firstPoint.x * canvas.width,
                firstPoint.y * canvas.height
            );

            // Draw to this point, then the next point,
            // until the whole line/path is drawn
            stroke.points.forEach(point => {

                ctx.lineTo(
                    point.x * canvas.width,
                    point.y * canvas.height
                );

            });

            ctx.stroke();

        });

    }


    /*
     * Redraw whenever drawing/current stroke changes
     */
    useEffect(() => {

        // Show the live drawing and saved strokes
        redrawCanvas();

    }, [
        drawing,
        currentStroke,
        brushColor,
        brushSize
    ]);


    /*
     * Mouse down
     */
    function handleMouseDown(e) {

        const canvas = canvasRef.current;

        if (!canvas) return;

        const rect =
            canvas.getBoundingClientRect();

        /*
         * Store the mouse position as a normalized value
         * instead of storing the actual canvas pixel position.
         * This allows the drawing to resize with the canvas.
         */
        const x =
            (e.clientX - rect.left) /
            rect.width;

        const y =
            (e.clientY - rect.top) /
            rect.height;

        // Start drawing
        setIsDrawing(true);

        /*
         * Store the first point of the stroke.
         * This function is used to store the point where
         * the mouse is pressed, not to draw directly.
         */
        setCurrentStroke([
            {
                x,
                y
            }
        ]);
    }


    /*
     * Mouse movement
     */
    function handleMouseMove(e) {

        if (!isDrawing) return;

        const canvas = canvasRef.current;

        if (!canvas) return;

        const rect =
            canvas.getBoundingClientRect();

        /*
         * Get the current mouse position and convert it
         * into normalized coordinates (0 to 1).
         */
        const x =
            (e.clientX - rect.left) /
            rect.width;

        const y =
            (e.clientY - rect.top) /
            rect.height;

        /*
         * Continuously store mouse points/strokes
         * while the mouse button is held down.
         */
        setCurrentStroke(prev => [
            ...prev,
            {
                x,
                y
            }
        ]);

    }


    /*
     * Mouse released
     */
    function handleMouseUp() {

        if (!isDrawing) return;

        setIsDrawing(false);

        /*
         * If there is no point in the current stroke,
         * there is nothing to save.
         */
        if (currentStroke.length < 1) {
            setCurrentStroke([]);
            return;
        }

        /*
         * Store the completed stroke with its
         * brush color, brush size and all its points.
         */
        const newStroke = {

            color: brushColor,

            width: brushSize,

            points: currentStroke

        };

        /*
         * Add the newly completed stroke to the
         * existing saved drawing.
         */
        setNote({

            drawing: [
                ...drawing,
                newStroke
            ]

        });

        // Clear the temporary/current stroke
        setCurrentStroke([]);

        /*
         * A new drawing was created, so the old redo history
         * should be cleared.
         */
        setRedoStack([]);

    }


    return (

        <div
            ref={containerRef}
            style={{
                position: "absolute",
                inset: 0
            }}
        >

            <canvas
                ref={canvasRef}

                className="drawingCanvas"

                style={{
                    pointerEvents:
                        mode === "drawing"
                            ? "auto"
                            : "none"
                }}

                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />

        </div>

    );
}

export default DrawingCanvas;