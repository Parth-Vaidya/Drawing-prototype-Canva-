import "../style/DrawingToolbar.css";

function DrawingToolbar({
    clearCanvas,
    undo,
    redo,
    setBrushColor,
    setBrushSize,
}) {
    return (
        <div className="drawingToolbar">

            {/* Brush Size */}

            <select
                className="drawingSelect"
                defaultValue={3}
                onChange={(e) =>
                    setBrushSize(
                        Number(e.target.value)
                    )
                }
            >
                <option value={2}>
                    Thin
                </option>

                <option value={5}>
                    Medium
                </option>

                <option value={10}>
                    Thick
                </option>
            </select>


            <div className="drawingToolbarSeparator" />


            {/* Brush Color */}

            <select
                className="drawingSelect"
                defaultValue="black"
                onChange={(e) =>
                    setBrushColor(
                        e.target.value
                    )
                }
            >
                <option value="black">
                    Black
                </option>

                <option value="red">
                    Red
                </option>

                <option value="blue">
                    Blue
                </option>

                <option value="green">
                    Green
                </option>
            </select>


            <div className="drawingToolbarSeparator" />


            {/* Clear */}

            <button
                className="drawingToolbarButton danger"
                onClick={clearCanvas}
            >
                <span className="drawingToolbarIcon">
                    ✕
                </span>

                <span>
                    Clear
                </span>
            </button>


            {/* Undo */}

            <button
                className="drawingToolbarButton"
                onClick={undo}
            >
                <span className="drawingToolbarIcon">
                    ↶
                </span>

                <span>
                    Undo
                </span>
            </button>


            {/* Redo */}

            <button
                className="drawingToolbarButton"
                onClick={redo}
            >
                <span className="drawingToolbarIcon">
                    ↷
                </span>

                <span>
                    Redo
                </span>
            </button>

        </div>
    );
}

export default DrawingToolbar;