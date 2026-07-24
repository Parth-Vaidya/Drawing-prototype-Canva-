

function SidebarNote({
    note,
    currentNoteId,
    setCurrentNoteId,
    updateTitle,
}) {
    return (
        <button
            className={
                currentNoteId === note.id
                    ? "noteButton active"
                    : "noteButton"
            }
            onClick={() => setCurrentNoteId(note.id)}
        >
            <input
                className="noteTitle"
                value={note.title}
                onChange={(e) =>
                    updateTitle(note.id, e.target.value)
                }
            />
        </button>
    );
}

export default SidebarNote;