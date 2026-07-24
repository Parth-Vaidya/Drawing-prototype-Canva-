import SidebarNote from "./SidebarNote";
import "../style/Sidebar.css";

function Sidebar({
    notes,
    currentNoteId,
    setCurrentNoteId,
    createNewNote,
    updateTitle
}) {

    return (
        <div className="sidebar">
            <h2>My Notes</h2>
            {
                notes.map(note => (
                    <SidebarNote
                        key={note.id}
                        note={note}
                        currentNoteId={currentNoteId}
                        setCurrentNoteId={setCurrentNoteId}
                        updateTitle={updateTitle}
                    />
                ))
            }

            <button
                className="newNoteButton"
                onClick={createNewNote}
            >
                + New Note
            </button>

        </div>
    );

}

export default Sidebar;