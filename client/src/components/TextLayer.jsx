import { useEffect } from "react";
import Link from "@tiptap/extension-link";

import {
    useEditor,
    EditorContent
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import "../style/TextLayer.css";

function TextLayer({
    mode,
    note,
    setNote,
    onEditorReady
}) {

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
        ],

        content: note?.text || "",

        editorProps: {
            attributes: {
                class:
                    "tiptap notebookTextEditor",
            },
        },

        onUpdate({ editor }) {
            setNote({
                text: editor.getHTML()
            });
        }
    });


    // =========================================================
    // GIVE EDITOR INSTANCE TO PARENT
    // =========================================================

    useEffect(() => {

        if (!onEditorReady) {
            return;
        }

        onEditorReady(editor);

        return () => {
            onEditorReady(null);
        };

    }, [editor, onEditorReady]);


    // =========================================================
    // LOAD TEXT FOR CURRENT PAGE
    // =========================================================

    useEffect(() => {

        if (!editor || !note) {
            return;
        }

        const newHTML = note.text || "";

        if (editor.getHTML() !== newHTML) {

            editor.commands.setContent(
                newHTML,
                false
            );

        }

    }, [note?.id, editor]);


    // =========================================================
    // HANDLE CLICK ON BLANK SHEET
    // =========================================================

    function handleLayerClick(e) {

        if (!editor) {
            return;
        }

        /*
         * If we clicked inside the actual editor,
         * let Tiptap handle the cursor normally.
         */

        if (e.target.closest(".tiptap")) {
            return;
        }


        /*
         * If we clicked on the blank area,
         * focus the editor at the end of the text.
         */

        editor.commands.focus("end");
    }


    // =========================================================
    // EDITOR NOT READY
    // =========================================================

    if (!editor) {
        return null;
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div
            className="textLayer"

            onClick={handleLayerClick}

            style={{
                pointerEvents:
                    mode === "text"
                        ? "auto"
                        : "none"
            }}
        >

            <EditorContent
                editor={editor}
            />

        </div>
    );
}

export default TextLayer;