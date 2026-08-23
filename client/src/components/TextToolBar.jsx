import "../style/TextToolbar.css";

function TextToolbar({ editor }) {
    if (!editor) {
        return null;
    }

    return (
        <div className="textToolbar">

            {/* Bold */}
            <button
                className={
                    editor.isActive("bold")
                        ? "toolbarButton active"
                        : "toolbarButton"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                }
            >
                <strong>B</strong>
                <span>Bold</span>
            </button>

            {/* Italic */}
            <button
                className={
                    editor.isActive("italic")
                        ? "toolbarButton active"
                        : "toolbarButton"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run()
                }
            >
                <em>I</em>
                <span>Italic</span>
            </button>

            <div className="toolbarSeparator" />

            {/* Code */}
            <button
                className={
                    editor.isActive("code")
                        ? "toolbarButton active"
                        : "toolbarButton"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleCode()
                        .run()
                }
            >
                <span className="codeIcon">
                    {"</>"}
                </span>
                <span>Code</span>
            </button>

            <div className="toolbarSeparator" />

            {/* Bullet List */}
            <button
                className={
                    editor.isActive("bulletList")
                        ? "toolbarButton active"
                        : "toolbarButton"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBulletList()
                        .run()
                }
            >
                <span className="listIcon">
                    ☷
                </span>
                <span>Bullet List</span>
            </button>

            {/* Ordered List */}
            <button
                className={
                    editor.isActive("orderedList")
                        ? "toolbarButton active"
                        : "toolbarButton"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleOrderedList()
                        .run()
                }
            >
                <span className="listIcon">
                    ☷
                </span>
                <span>Ordered List</span>
            </button>

        </div>
    );
}

export default TextToolbar;