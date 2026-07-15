import "../style/TextLayer.css";


function TextLayer({ mode, note, setNote }) {

    function handleInput(e) {
        setNote(prev => ({
            ...prev,
            text: e.target.innerHTML
        }));
    }

    return (
        <div
            className="textLayer"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            dangerouslySetInnerHTML={{
                __html: note.text
            }}
            style={{
                pointerEvents: mode === "text" ? "auto" : "none"
            }}
        >
        </div>
    );

}

export default TextLayer;