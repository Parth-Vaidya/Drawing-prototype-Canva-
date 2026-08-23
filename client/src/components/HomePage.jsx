import "../style/HomePage.css";

import TextToolbar from "./TextToolBar.jsx";
import DrawingToolbar from "./DrawingToolbar";


function HomePage({
    editor,

    clearCanvas,
    undo,
    redo,

    setBrushColor,
    setBrushSize,

    mode,
    setMode,

    createNewNote,
    createNewPage,

    goToPreviousPage,
    goToNextPage,

    currentPageNumber,
    totalPages,

    deleteCurrentPage
}) {

    return (
        <div className="homePageControls">

            {/* =========================
                TOP MODE BAR
            ========================== */}

            <div className="topControls">

                <div className="modeControls">

                    <button
                        className={`modeButton ${mode === "text"
                                ? "active"
                                : ""
                            }`}

                        onClick={() =>
                            setMode("text")
                        }
                    >
                        Text
                    </button>


                    <button
                        className={`modeButton ${mode === "drawing"
                                ? "active"
                                : ""
                            }`}

                        onClick={() =>
                            setMode("drawing")
                        }
                    >
                        Drawing
                    </button>

                </div>


                {/* =========================
                    TEXT TOOLBAR
                ========================== */}

                {mode === "text" && (
                    <TextToolbar
                        editor={editor}
                    />
                )}


                {/* =========================
                    DRAWING CONTROLS
                ========================== */}

                {mode === "drawing" && (

                    <DrawingToolbar
                        clearCanvas={clearCanvas}
                        undo={undo}
                        redo={redo}
                        setBrushColor={setBrushColor}
                        setBrushSize={setBrushSize}
                    />

                )}

            </div>


            {/* =========================
                BOTTOM CONTROLS
            ========================== */}

            <div className="bottomControls">

                {/* Page navigation */}

                <div className="pageNavigation">

                    <button
                        className="pageArrow previous"

                        onClick={
                            goToPreviousPage
                        }

                        disabled={
                            currentPageNumber <= 1
                        }
                    >
                        ◀
                    </button>


                    <span className="pageCount">

                        Page {currentPageNumber} /{" "}
                        {totalPages}

                    </span>


                    <button
                        className="pageArrow next"

                        onClick={
                            goToNextPage
                        }

                        disabled={
                            currentPageNumber >=
                            totalPages
                        }
                    >
                        ▶
                    </button>

                </div>


                {/* Page actions */}

                <div className="pageActions">

                    <button
                        className="controlButton"

                        onClick={
                            createNewPage
                        }
                    >
                        + New Page
                    </button>


                    <button
                        className="controlButton danger"

                        onClick={
                            deleteCurrentPage
                        }

                        disabled={
                            totalPages <= 1
                        }
                    >
                        Delete Page
                    </button>

                </div>

            </div>

        </div>
    );
}


export default HomePage;