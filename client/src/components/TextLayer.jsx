import { useRef } from "react";
import Paragraph from "./Paragraph";
import "../style/TextLayer.css";


function TextLayer({ mode, note, setNote, editorRef }) {

    function handleClick(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;

        setNote(prev => ({
            ...prev,
            content: [
                ...prev.content,
                {
                    id: Date.now(),
                    type: "paragraph",
                    y: y,
                    html: ""
                }
            ]
        }));
    }

    function saveNote() {
        const html = editorRef.current.innerHTML;

        setNote(prev => ({
            ...prev,
            text: html
        }));
    }

    return (
        <div
            className="textLayer"
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            // onInput={handleInput}
            // dangerouslySetInnerHTML={{
            //     __html: note.text
            // }}
            style={{
                pointerEvents: mode === "text" ? "auto" : "none"
            }}
            onClick={handleClick}
        >
            {/* {
                note.content.map(paragraph => (
                    <Paragraph
                        key={paragraph.id}
                        paragraph={paragraph}
                    />
                ))
            } */}
        </div>
    );

}

export default TextLayer;