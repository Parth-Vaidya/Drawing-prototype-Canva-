import "../style/ContextMenu.css";

function FolderContextMenu({
    menu,
    menuRef,
    onRenameFolder,
    deleteFolder,
    closeMenu
}) {

    if (!menu.open) return null;

    return (
        <div
            ref={menuRef}
            className="contextMenu"
            style={{
                position: "fixed",
                left: menu.x,
                top: menu.y,
            }}
        >

            <button
                onClick={() => {
                    onRenameFolder(menu.folder);
                    closeMenu();
                }}
            >
                Rename
            </button>

            <button
                onClick={() => {
                    deleteFolder(menu.folder.id);
                    closeMenu();
                }}
            >
                Delete
            </button>

        </div>
    );
}
export default FolderContextMenu;