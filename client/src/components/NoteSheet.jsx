import DrawingCanvas from "./DrawingCanvas";
import TextLayer from "./TextLayer";

import "../style/NoteSheet.css";


function NoteSheet({
    drawing,
    note,
    setNote,
    setRedoStack,
    brushColor,
    brushSize,
    mode,
    onEditorReady,
    title,
    onTitleChange
}) {

    return (
        <div className="noteSheet">

            <TextLayer
                mode={mode}
                note={note}
                setNote={setNote}
                title={title}
                onTitleChange={onTitleChange}
                onEditorReady={onEditorReady}
            />

            <DrawingCanvas
                drawing={drawing}
                setNote={setNote}
                setRedoStack={setRedoStack}
                brushColor={brushColor}
                brushSize={brushSize}
                mode={mode}
            />

        </div>
    );
}


export default NoteSheet;