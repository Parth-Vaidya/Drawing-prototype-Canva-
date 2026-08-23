# Notebook App — Frontend Documentation

## 1. Project Overview

The Notebook App is a React-based digital notebook application designed around a notebook-style workspace where users can:

- Create and manage notes.
- Organize notes into folders.
- Create multiple pages inside each note.
- Draw on individual pages.
- Edit text on individual pages.
- Switch between text and drawing modes.
- Use drawing tools such as brush size, color, clear, undo, and redo.
- Navigate between pages.
- Persist notes and folders using browser LocalStorage.
- Use Tiptap as the foundation for rich-text editing.
- Use a floating Tiptap-based toolbar for notebook controls.

The application evolved incrementally from a single-page drawing notebook into a multi-page notebook with page-specific text and drawing data.

The latest development stage focused on integrating a floating Tiptap UI toolbar while preserving the existing notebook sheet and page system.

At the end of Part 6:

```text
Tiptap Toolbar → Working
Text/Drawing Mode → Working
Drawing Controls → Connected
Page Controls → Working
Note Sheet → Layout issue after toolbar integration
```

The primary unresolved issue is the relationship between the floating toolbar and the notebook sheet layout.

---

# 2. Development Evolution

The project developed through several major stages.

```text
Initial Notebook
      ↓
Responsive Drawing Canvas
      ↓
Multiple Notes
      ↓
Page-Based Note Structure
      ↓
Page Navigation
      ↓
Page-Specific Drawing
      ↓
Page-Specific Text
      ↓
Tiptap Integration
      ↓
Workspace/Sizing Improvements
      ↓
Floating Tiptap Toolbar
      ↓
Current Layout Issue
```

---

# 3. Development Stage — Responsive Drawing Canvas

The original notebook system focused primarily on drawing.

The canvas:

- occupied the notebook sheet.
- resized with its container.
- stored drawing points using normalized coordinates.
- redrew saved strokes after resizing.
- supported brush color and size.
- supported drawing/text modes.
- persisted drawing through React state and LocalStorage.

Relevant components included:

```text
DrawingCanvas.jsx
NoteSheet.jsx
App.jsx
DrawingCanvas.css
NoteSheet.css
```

The responsive canvas became the stable foundation for later page development.

---

# 4. Development Stage — Multiple Pages

The original note model was changed from:

```text
Note
├── text
└── drawing
```

to:

```text
Note
└── pages[]
    ├── text
    └── drawing
```

The intended architecture became:

```text
Note
│
├── metadata
│   ├── id
│   ├── title
│   ├── folderId
│   └── pinned
│
└── pages
    │
    ├── Page
    │   ├── text/content
    │   └── drawing
    │
    └── Page
        ├── text/content
        └── drawing
```

This allowed each page to maintain independent content.

---

# 5. Current Note Data Model

The page-based note structure used in the later implementation is:

```js
{
    id,
    title: "Untitled",

    pages: [
        {
            id,
            text: "",
            drawing: []
        }
    ],

    folderId,
    pinned: false,
    createdAt,
    lastEdited
}
```

A page therefore contains:

```js
{
    id,
    text,
    drawing
}
```

The note title belongs to the note, not individual pages.

The user explicitly decided that pages do not need separate visible titles.

The intended conceptual model is:

```text
Note
│
├── Title / metadata
│
└── Pages
    ├── Page 1
    │   ├── Text
    │   └── Drawing
    │
    ├── Page 2
    │   ├── Text
    │   └── Drawing
    │
    └── Page N
        ├── Text
        └── Drawing
```

---

# 6. Multi-Page Functionality

The application supports:

- Creating a page.
- Selecting a page.
- Previous page.
- Next page.
- Deleting a page.
- Displaying the current page number.
- Preventing deletion when only one page remains.
- Selecting another page after deletion.
- Resetting redo history when changing page context.

The toolbar/page interface includes:

```text
◀
Page X / Y
Delete Page
+ New Page
▶
```

Relevant callbacks include:

```js
createNewPage
goToPreviousPage
goToNextPage
deleteCurrentPage
```

---

# 7. Page State

The application uses:

```js
currentPageId
```

to identify the active page.

The current page is derived from the selected note:

```js
const currentPage =
    currentNote?.pages?.find(
        (page) => page.id === currentPageId
    ) || currentNote?.pages?.[0];
```

The page navigation flow is:

```text
User changes page
        ↓
currentPageId changes
        ↓
currentPage recalculated
        ↓
NoteSheet receives current page data
        ↓
redoStack cleared
```

---

# 8. Page Creation

Creating a page produces an empty page:

```js
{
    id,
    text: "",
    drawing: []
}
```

The new page becomes the active page.

The redo stack is cleared because the new page represents a new drawing context.

Flow:

```text
New Page
   ↓
Create empty page
   ↓
Append to current note
   ↓
Set currentPageId
   ↓
Clear redo history
```

---

# 9. Page Deletion

Page deletion checks whether more than one page exists.

Conceptually:

```text
If pages.length <= 1
    → do not delete

Otherwise
    → remove current page
    → select another page
    → clear redo history
```

This guarantees:

```text
Every note has at least one page.
```

---

# 10. Drawing System

Drawing belongs to the current page:

```text
currentNote
    ↓
currentPage
    ↓
currentPage.drawing
```

This was a major architectural change from the original note-level drawing model.

---

# 11. Drawing Data

The drawing is an array of strokes.

Earlier implementations used strokes conceptually structured as:

```js
{
    color,
    width,
    points: [
        { x, y },
        { x, y }
    ]
}
```

Points are normalized relative to the canvas dimensions.

The purpose of normalization is to allow the drawing to remain correct when the canvas changes size.

The later Part 6 documentation did not include the complete `DrawingCanvas.jsx` implementation, so the exact final stroke implementation should not be assumed beyond this established architecture.

---

# 12. Responsive Canvas

The canvas was designed to resize according to its containing note sheet.

The canvas uses:

```css
.drawingCanvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
```

The note sheet is:

```css
.noteSheet {
    position: relative;
}
```

Therefore:

```text
NoteSheet
   ↓
relative containing block
   ↓
DrawingCanvas
   ↓
absolute inset: 0
```

This allows the drawing canvas to occupy the notebook sheet.

Earlier implementation used `ResizeObserver` to resize the canvas and redraw normalized strokes.

---

# 13. Drawing Modes

The application has two primary modes:

```text
drawing
text
```

The state is represented by:

```js
mode
```

with:

```js
setMode("drawing")
setMode("text")
```

---

# 14. Drawing Controls

The drawing toolbar provides:

### Brush Size

```text
Thin   → 2
Medium → 5
Thick  → 10
```

The setter is:

```js
setBrushSize(Number(value))
```

### Brush Color

Available values:

```text
black
red
blue
green
```

The setter is:

```js
setBrushColor(value)
```

### Clear

```js
clearCanvas()
```

### Undo

```js
undo()
```

### Redo

```js
redo()
```

---

# 15. Drawing Undo/Redo

Undo and redo operate on drawing strokes.

Undo:

```text
Current page
    ↓
Last stroke
    ↓
Remove stroke
    ↓
Add stroke to redoStack
```

Redo:

```text
redoStack
    ↓
Last undone stroke
    ↓
Restore stroke
    ↓
Remove from redoStack
```

The redo stack is stored in React state:

```js
redoStack
```

and is intentionally cleared when the page context changes.

---

# 16. Redo Reset Rules

Redo history is cleared when:

- Changing page.
- Creating a new page.
- Creating a new note.
- Duplicating a note.
- Deleting a page.
- Clearing the canvas.

This prevents drawing history from one context being incorrectly applied to another.

---

# 17. Text Editing

The application moved from an experimental custom paragraph-based editor toward **Tiptap**.

The earlier paragraph system attempted to represent text as custom paragraph objects, but this approach was abandoned.

The intended architecture became:

```text
Tiptap
   ↓
Editor
   ↓
HTML
   ↓
currentPage.text
```

---

# 18. Tiptap Integration

The text layer uses Tiptap APIs including:

```js
useEditor
EditorContent
StarterKit
```

The earlier implementation used:

```js
useEditor({
    extensions: [
        StarterKit
    ],
    content: note?.text || "",
    onUpdate({ editor }) {
        setNote({
            text: editor.getHTML()
        });
    }
})
```

Text is therefore represented as HTML.

The conceptual persistence model is:

```text
Current Page
    ↓
text
    ↓
Tiptap HTML
```

---

# 19. Text/Drawing Layer Interaction

The notebook contains two overlapping layers:

```text
DrawingCanvas
TextLayer
```

The drawing canvas uses:

```css
z-index: 1;
```

while the text layer uses:

```css
z-index: 2;
```

Therefore:

```text
TextLayer
   ↑
DrawingCanvas
```

The text layer can appear above the drawing canvas.

---

# 20. Mode-Dependent Pointer Interaction

The text layer is interactive in text mode:

```text
mode === "text"
    ↓
pointer events enabled
```

In drawing mode:

```text
mode === "drawing"
    ↓
text layer pointer events disabled
```

This prevents the text editor from intercepting drawing interaction.

---

# 21. Text Toolbar

The latest toolbar visually contains:

```text
B
I
U
H1
•
```

representing:

- Bold
- Italic
- Underline
- Heading 1
- Bullet/list

However, these controls are currently **visual only** in the implementation described in Part 6.

No actual formatting callbacks were connected in the shown `HomePage.jsx`.

Therefore:

```text
Text toolbar UI → Implemented
Text formatting → Not yet implemented
```

---

# 22. Note Management

The application supports multiple notes.

Implemented note operations include:

- Create note.
- Delete note.
- Duplicate note.
- Rename note.
- Select note.
- Move note to folder.

---

# 23. Creating a Note

A new note contains one initial page.

Conceptually:

```js
{
    id,
    title: "Untitled",
    pages: [
        {
            id,
            text: "",
            drawing: []
        }
    ],
    folderId,
    pinned: false,
    createdAt,
    lastEdited
}
```

The application ensures that at least one note remains.

---

# 24. Duplicating a Note

Duplicating a note:

- Creates a new note ID.
- Appends `" Copy"` to the title.
- Creates new page IDs.
- Copies page text.
- Deep-copies drawing point objects.
- Updates timestamps.
- Selects the duplicated note.
- Clears redo history.

Conceptually:

```text
Original Note
      ↓
Duplicate
      ↓
New Note ID
      ↓
New Page IDs
      ↓
Copied Content
```

---

# 25. Deleting a Note

The application prevents the notebook from having zero notes.

If the selected note is deleted:

```text
Delete current note
       ↓
Select another note
       ↓
Display remaining note
```

---

# 26. Note Titles

Notes have titles.

The title is treated as note metadata rather than page metadata.

Therefore:

```text
Note title
    ≠
Page title
```

Pages primarily contain:

```text
text
drawing
```

---

# 27. Folder System

Folders are maintained separately from notes.

A folder is conceptually:

```js
{
    id,
    name,
    createdAt
}
```

Implemented operations include:

- Create folder.
- Rename folder.
- Delete folder.
- Move notes into folders.

---

# 28. Folder Deletion

When a folder is deleted, notes belonging to that folder become unfiled:

```js
folderId: null
```

The folder itself is removed.

---

# 29. LocalStorage Persistence

The application uses browser LocalStorage for persistence.

Main keys:

```text
notes
folders
```

Notes:

```js
localStorage.getItem("notes")
localStorage.setItem(
    "notes",
    JSON.stringify(notes)
)
```

Folders:

```js
localStorage.getItem("folders")
localStorage.setItem(
    "folders",
    JSON.stringify(folders)
)
```

---

# 30. Backward-Compatible Note Loading

During the page migration, older notes could still have:

```text
note.text
note.drawing
```

instead of:

```text
note.pages
```

The application therefore introduced normalization when loading saved notes.

Conceptually:

```text
Old Note
├── text
└── drawing

        ↓ migration

New Note
└── pages
    └── Page
        ├── text
        └── drawing
```

This reduced incompatibility with older LocalStorage data.

Earlier in development, incompatible LocalStorage structures caused errors such as:

```text
drawing is not iterable
pages.map is undefined
pages.find is undefined
```

The migration/normalization approach was introduced to address this.

---

# 31. Main Application Architecture

The application has evolved toward:

```text
App
│
├── Sidebar
│   ├── Notes
│   └── Folders
│
└── Workspace
    │
    ├── HomePage
    │   ├── Floating Toolbar
    │   │   ├── Mode Controls
    │   │   ├── Drawing Controls
    │   │   └── Text Controls
    │   │
    │   └── Page Controls
    │
    └── NoteSheet
        │
        ├── DrawingCanvas
        │
        └── TextLayer
            └── Tiptap
```

`App.jsx` acts as the central state/coordinator layer.

---

# 32. Important Application State

The major state values established across the development are:

```text
isSidebarOpen
mode
redoStack
brushColor
brushSize
currentNoteId
notes
folders
currentPageId
```

Derived state includes:

```text
currentNote
currentPage
```

---

# 33. `App.jsx`

`App.jsx` is the primary application state owner.

It coordinates:

- Notes.
- Folders.
- Selected note.
- Selected page.
- Drawing settings.
- Drawing operations.
- Undo/redo.
- Page creation/deletion/navigation.
- Note operations.
- Folder operations.
- LocalStorage persistence.

Important functions developed through the project include:

```text
createNewNote()
createNewPage()
deleteCurrentPage()
goToPreviousPage()
goToNextPage()

clearCanvas()
undo()
redo()

updateCurrentPage()
updateTitle()

createFolder()
renameFolder()
deleteFolder()
moveNoteToFolder()

deleteNote()
duplicateNote()
```

---

# 34. `HomePage.jsx`

`HomePage` has evolved from a traditional toolbar into the application's floating control interface.

The latest version receives:

```text
clearCanvas
undo
redo
setBrushColor
setBrushSize
mode
setMode

createNewPage
goToPreviousPage
goToNextPage
currentPageNumber
totalPages
deleteCurrentPage
```

An earlier version also received:

```text
createNewNote
```

but this was not present in the later/final toolbar implementation.

---

# 35. Tiptap Toolbar Integration

The toolbar imports:

```jsx
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "./tiptap-ui-primitive/toolbar";
```

The main toolbar is rendered as:

```jsx
<Toolbar
    variant="fixed"
    className="notebookToolbar"
>
```

The Tiptap CLI command used was:

```text
npx @tiptap/cli@latest add toolbar
```

The toolbar components were installed into:

```text
src/components/
```

---

# 36. Tiptap Component Files

The installation created files such as:

```text
src/components/tiptap-ui-primitive/toolbar/
    toolbar.tsx
    index.tsx
    toolbar.scss
```

and:

```text
src/components/tiptap-ui-primitive/separator/
    separator.tsx
    index.tsx
    separator.scss
```

Supporting files included:

```text
src/hooks/use-menu-navigation.ts
src/hooks/use-composed-ref.ts
src/lib/tiptap-utils.ts
src/styles/_variables.scss
src/styles/_keyframe-animations.scss
src/scss.d.ts
```

The exact behavior of these supporting files was not examined.

---

# 37. Floating Toolbar Design

The toolbar was deliberately changed from a normal layout element into a floating element.

The final toolbar CSS uses:

```css
.notebookToolbar {
    position: fixed !important;
    top: 12px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;

    z-index: 1000;

    width: max-content !important;
    max-width: calc(100vw - 40px);

    box-sizing: border-box;
    border-radius: 12px;
}
```

The purpose is:

```text
Toolbar
    ↓
floats above notebook
    ↓
does not consume notebook vertical space
```

---

# 38. Toolbar Mode Switching

The toolbar displays different controls depending on the current mode.

## Text mode

```text
Text
B
I
U
H1
•
```

## Drawing mode

```text
Drawing
Brush Size
Brush Color
Undo
Redo
Clear
```

This keeps the toolbar compact.

---

# 39. Page Controls

The page controls remain separate from the floating toolbar.

They provide:

```text
Previous
Delete Page
Page X / Y
New Page
Next
```

Disabled states include:

```text
Previous disabled → first page
Next disabled     → last page
Delete disabled   → only one page
```

---

# 40. CSS Architecture

The project uses multiple CSS files.

Important styles include:

```text
App.css
HomePage.css
NoteSheet.css
DrawingCanvas.css
TextLayer.css
```

The exact final ownership of some toolbar rules between `HomePage.css` and `App.css` was inconsistent across the development conversation, so the physical file organization should be verified in the current repository.

---

# 41. Notebook Sheet

The notebook sheet is intended to occupy the available notebook workspace.

Current known CSS:

```css
.noteSheet {
    position: relative;

    width: 100%;
    height: 100%;

    margin: 0;

    background: white;

    border: 1px solid #888;

    border-radius: 10px;

    overflow: hidden;

    box-sizing: border-box;
}
```

The sheet acts as the containing block for the drawing/text layers.

---

# 42. Drawing Canvas CSS

The canvas uses:

```css
.drawingCanvas {
    position: absolute;

    inset: 0;

    width: 100%;
    height: 100%;

    display: block;

    background: white;

    border: 2px solid #333;
    border-radius: 10px;

    box-sizing: border-box;

    z-index: 1;

    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

    cursor: crosshair;
}
```

This allows the canvas to occupy the entire sheet.

---

# 43. Text Layer CSS

The text layer is:

```css
.textLayer {
    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;

    z-index: 2;
}
```

The Tiptap editor is styled approximately as:

```css
.textLayer .tiptap {
    width: 100%;
    min-height: 100%;

    box-sizing: border-box;

    padding: 30px;

    outline: none;

    font-size: 18px;
    line-height: 1.7;

    text-align: left;

    word-break: break-word;
}
```

The editor can scroll vertically inside the text layer.

---

# 44. Workspace Layout

The application originally used a flex-based workspace:

```css
.workspace {
    display: flex;
    flex-direction: column;
}
```

The sheet and controls were then arranged through ordering.

Earlier layout:

```text
Top Controls
      ↓
Note Sheet
      ↓
Bottom Controls
```

The project later moved toward a grid architecture.

---

# 45. Workspace Grid Proposal

A proposed layout was:

```css
.workspace {
    display: grid;

    grid-template-rows:
        auto
        minmax(0, 1fr)
        auto;
}
```

The intended structure was:

```text
Row 1 → top controls
Row 2 → notebook sheet
Row 3 → bottom controls
```

The sheet:

```css
.workspaceSheet {
    grid-row: 2;

    min-width: 0;
    min-height: 0;

    width: 100%;
    height: 100%;
}
```

The purpose was to let the notebook sheet consume all remaining vertical space.

---

# 46. Workspace Sizing Issue

One major issue occurred before the floating toolbar work.

The notebook sheet was considered:

- Too small.
- Surrounded by excessive empty workspace.
- Especially inefficient on tablet/fullscreen layouts.

The problem was determined to be more related to the parent workspace layout than the sheet's own:

```css
width: 100%;
height: 100%;
```

Changing the sheet alone did not resolve the issue.

---

# 47. Floating Toolbar Layout Issue

After integrating the Tiptap toolbar, a new problem appeared.

The screenshot/state became:

```text
Sidebar       → visible
Toolbar       → visible
Bottom page controls → visible
Note sheet    → missing
```

The toolbar itself was working.

The notebook sheet was not.

---

# 48. Suspected `display: contents` Problem

An existing rule was:

```css
.homePageControls {
    display: contents;
}
```

This became suspicious after introducing the fixed toolbar.

`display: contents` removes the element's own layout box.

A proposed replacement was:

```css
.homePageControls {
    position: relative;
    width: 100%;
    height: 100%;
}
```

However, this was **not confirmed as the final solution**.

Therefore the current status remains:

```text
Toolbar → Working
Sheet → Layout unresolved
```

---

# 49. Desired Final Workspace Layout

The intended UI is:

```text
┌─────────────────────────────────────────────┐
│                                             │
│              Floating Toolbar               │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │                                       │  │
│  │             NOTE SHEET                │  │
│  │                                       │  │
│  │                                       │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│     ◀    Page 1 / 5    + New Page    ▶    │
│                         Delete Page         │
└─────────────────────────────────────────────┘
```

The toolbar should float over the notebook, while the notebook should use as much available space as possible.

---

# 50. Sidebar

The application includes a sidebar containing:

```text
My Notes
Folders
All Notes
Unfiled
Folder names
Search
Notes
+ New Note
```

The sidebar supports the broader note/folder system.

Earlier implementations included:

```text
Sidebar.jsx
SidebarNote.jsx
ContextMenu.jsx
FolderContextMenu.jsx
```

The complete current implementation was not reproduced in Part 6, so exact current sidebar behavior should be verified from the repository.

---

# 51. Sidebar Note Operations

Across the earlier development stages, note operations included:

```text
Rename
Move
Duplicate
Delete
Select
```

The sidebar also displayed note titles and folder information.

The exact final implementation of all sidebar functionality was not reproduced in Part 6.

---

# 52. Context Menus

Earlier development included:

### Note Context Menu

```text
Rename
Move to
Duplicate
Delete
```

### Folder Context Menu

```text
Rename
Delete
```

These components existed during the project's development.

Their latest implementation should be verified from the current source.

---

# 53. Search

The sidebar contains a search field.

Earlier implementation supported searching notes and displaying folder information during search.

The exact final search implementation was not included in the latest toolbar-focused development.

---

# 54. Important Debugging History

The project encountered several structural problems during the transition to pages.

## Error — `pages.find`

Error:

```text
Cannot read properties of undefined
(reading 'find')
```

Cause:

Some notes did not have a `pages` array.

Solution:

New notes were updated to contain pages and data normalization was introduced.

---

## Error — `currentPage is not defined`

Error:

```text
ReferenceError: currentPage is not defined
```

Cause:

The current page variable was referenced before being defined.

Solution:

A derived `currentPage` was introduced.

---

## Error — `drawing is not iterable`

Error:

```text
TypeError: drawing is not iterable
```

Cause:

Old note-level drawing data was mixed with the new page-level drawing structure.

Solution:

Drawing was consistently moved toward:

```text
currentPage.drawing
```

---

## Error — `pages.map`

Error:

```text
Cannot read properties of undefined
(reading 'map')
```

Cause:

Some notes did not have pages.

Solution:

Page normalization and rebuilding from the known-working canvas architecture.

---

## Error — `resizeCanvas is not defined`

Cause:

The ResizeObserver referenced a function outside its scope.

Solution:

The resize function was restored inside the correct scope.

---

## New notes becoming black

Cause:

The new note data structure was incompatible with the canvas/page system.

Solution:

The project reverted to the stable responsive-canvas commit and rebuilt the page architecture incrementally.

---

## `currentPageId` initialization error

Error:

```text
Cannot access 'currentPageId' before initialization
```

Cause:

The state was referenced before initialization.

Solution:

State declaration/derived-state order was corrected.

---

# 55. Tiptap CLI Debugging

The Tiptap toolbar installation initially failed with:

```text
Failed to load jsconfig.json.
Couldn't find tsconfig.json
```

The CLI suggested:

```text
npx @tiptap/cli init
```

After project configuration was corrected, the toolbar installation succeeded.

---

# 56. Tiptap SCSS Import Error

Initially Vite reported:

```text
Failed to resolve import
"@/components/tiptap-ui-primitive/toolbar/toolbar.scss"
```

The toolbar installation subsequently created the required SCSS source files.

The toolbar then rendered successfully.

---

# 57. Current Feature Status

| Feature | Status |
|---|---|
| React application | Working |
| Vite | Working |
| Sidebar | Existing |
| Notes | Working |
| Folders | Working |
| Note creation | Working |
| Note deletion | Working |
| Note duplication | Working |
| Note title | Working |
| Multi-page notes | Working |
| Page creation | Working |
| Page deletion | Working |
| Page navigation | Working |
| Page counter | Working |
| Page-specific drawing | Working |
| Drawing mode | Working |
| Brush size | Working |
| Brush color | Working |
| Clear | Connected |
| Undo | Connected |
| Redo | Connected |
| Text editing | Tiptap integrated |
| Text persistence | Established in earlier stage |
| Text mode | Working |
| Tiptap toolbar | Working |
| Floating toolbar | Working |
| Text toolbar UI | Working |
| Bold/Italic/etc. actions | Not connected |
| Responsive canvas | Established |
| LocalStorage | Established |
| Workspace sizing | Needs refinement |
| NoteSheet after toolbar integration | **Current issue** |
| Toolbar/sheet layout | **Current issue** |
| Zoom/pan | Not implemented |
| Images/shapes/eraser | Not implemented |
| Backend persistence | Not implemented |

---

# 58. Current Architecture

The consolidated architecture is:

```text
                         NOTEBOOK APP
                              │
              ┌───────────────┴───────────────┐
              │                               │
           Sidebar                         Workspace
              │                               │
        Notes / Folders                ┌──────┴──────┐
                                       │             │
                                  Floating       Note Sheet
                                  Toolbar            │
                                       │       ┌──────┴──────┐
                                       │       │             │
                                    Text/      Drawing      Text
                                    Drawing    Canvas       Layer
                                    Controls                 │
                                                              │
                                                            Tiptap
```

The data architecture is:

```text
Note
│
├── Metadata
│   ├── id
│   ├── title
│   ├── folderId
│   ├── pinned
│   ├── createdAt
│   └── lastEdited
│
└── Pages
    │
    ├── Page
    │   ├── id
    │   ├── text
    │   └── drawing
    │
    ├── Page
    │   ├── id
    │   ├── text
    │   └── drawing
    │
    └── ...
```

The frontend architecture is fundamentally established.

The next immediate task is not another architectural rewrite. It is to fix the current toolbar → workspace → NoteSheet layout issue, then implement the actual Tiptap formatting actions.

---

# 59. Data Flow

The central state flow is:

```text
App State
   ↓
Props
   ↓
Child Components
   ↓
Callbacks
   ↓
App State Update
```

For a page:

```text
notes
  ↓
currentNote
  ↓
currentPage
  ↓
NoteSheet
  ├── DrawingCanvas
  └── TextLayer
```

For drawing:

```text
DrawingCanvas
      ↓
page.drawing
      ↓
notes
      ↓
LocalStorage
```

For text:

```text
Tiptap
   ↓
editor.getHTML()
   ↓
currentPage.text
   ↓
notes
   ↓
LocalStorage
```

---

# 60. Component Responsibilities

## `App.jsx`

Central state and application coordination.

## `Sidebar.jsx`

Note/folder navigation.

## `SidebarNote.jsx`

Individual note representation.

## `ContextMenu.jsx`

Note actions.

## `FolderContextMenu.jsx`

Folder actions.

## `HomePage.jsx`

Toolbar and page controls.

## `NoteSheet.jsx`

Notebook sheet container.

## `DrawingCanvas.jsx`

Drawing interaction/rendering.

## `TextLayer.jsx`

Text editing/Tiptap layer.

---

# 61. Important Design Decisions

## Decision 1 — Notes contain pages

```text
Note
└── pages[]
```

rather than treating each page as a separate note.

## Decision 2 — Pages own content

Each page owns:

```text
text
drawing
```

## Decision 3 — No page titles

The note title is metadata.

Pages do not require their own titles.

## Decision 4 — Tiptap for text

The custom paragraph system was abandoned.

Tiptap is the intended rich-text editor.

## Decision 5 — Floating toolbar

The toolbar should float above the notebook:

```css
position: fixed;
```

rather than consume a normal layout row.

## Decision 6 — Mode-specific controls

Text and drawing controls should not all appear simultaneously.

## Decision 7 — Page controls stay separate

Page navigation remains below the notebook.

## Decision 8 — Drawing coordinates should remain responsive

Normalized drawing coordinates allow the canvas to resize without corrupting saved drawings.

## Decision 9 — Redo is page-context-specific

Changing page clears redo history.

---

# 62. Development Lessons

### Keep the data model consistent

The biggest source of errors was mixing:

```text
note.drawing
```

with:

```text
note.pages[].drawing
```

All components consuming drawing data must follow the same model.

### New notes must match existing schema

A note created with the old schema can break page-based components.

Every new note must contain:

```js
pages: [...]
```

### Page changes affect undo/redo context

Undo/redo should not accidentally cross page boundaries.

### Parent layout determines sheet size

Changing:

```css
.noteSheet {
    width: 100%;
    height: 100%;
}
```

does not guarantee that the sheet actually gets large screen space.

The parent workspace must provide the available dimensions.

### Fixed elements and layout wrappers need careful interaction

The transition from a normal toolbar to:

```css
position: fixed;
```

changed the layout behavior.

The existing:

```css
display: contents;
```

wrapper should therefore be investigated carefully.

---

# 63. Current Unresolved Issue

The single most important unresolved issue is:

## Notebook sheet disappears after floating toolbar integration.

Current observed state:

```text
Sidebar       ✓
Floating Toolbar ✓
Bottom controls ✓
Notebook Sheet ✗
```

The exact cause has not been confirmed.

---

# 64. Recommended Next Debugging Step

The next development session should begin by inspecting the actual current repository versions of:

```text
App.jsx
App.css
HomePage.jsx
HomePage.css
NoteSheet.jsx
NoteSheet.css
```

The goal is to establish the real DOM hierarchy.

Specifically verify:

```text
App
 └── workspace
      ├── HomePage
      ├── workspaceSheet
      │    └── NoteSheet
      └── bottomControls
```

and determine whether any parent has:

```css
height: 0;
```

or:

```css
min-height: 0;
```

without a valid height chain.

Also check:

```css
display: contents;
```

because the `HomePage` wrapper may no longer provide a layout box.

---

# 65. Desired Final Layout

The target layout should be:

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│                 Floating Toolbar                    │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │                                             │   │
│   │                                             │   │
│   │              NOTE SHEET                     │   │
│   │                                             │   │
│   │                                             │   │
│   │                                             │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
│          ◀      Page 1 / 5      ▶                  │
│                                                     │
│              + New Page   Delete Page              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

The important requirement is:

> **The floating toolbar must overlay the notebook and must not reduce the available height of the notebook sheet.**

---

# 66. Future Work

## High Priority

### 1. Fix NoteSheet layout

Determine why the sheet disappeared after toolbar integration.

### 2. Verify workspace sizing

Make the notebook sheet consume the available screen area.

### 3. Verify responsive behavior

Test:

- Desktop.
- Fullscreen.
- Tablet-sized viewport.
- Smaller browser window.

## Medium Priority

### 4. Implement actual Tiptap formatting

Connect:

```text
Bold
Italic
Underline
Heading
Bullet list
```

to the active Tiptap editor.

For example, eventually:

```js
editor.chain().focus().toggleBold().run()
```

and equivalent Tiptap commands.

These commands are not yet part of the demonstrated Chat 6 implementation.

### 5. Improve toolbar UI

Eventually:

```text
Mode | Formatting | Drawing
```

could be grouped more cleanly.

### 6. Improve page controls

Potential future layout:

```text
◀ Previous
Page 1 / 5
Next ▶

+ New Page
Delete Page
```

## Long-Term

Potential future features:

```text
Rich text formatting
Images
Better drawing tools
Eraser
Shapes
Zoom
Pan
Page thumbnails
Cloud persistence
Backend API
Authentication
Export
PDF
Search
```

These are future possibilities, not implemented features established by Parts 1–6.

---

# 67. Final Project State

The Notebook App has progressed from a basic drawing notebook into a structured multi-page notebook application.

The current conceptual model is:

```text
                         NOTEBOOK APP
                              │
              ┌───────────────┴───────────────┐
              │                               │
           Sidebar                         Workspace
              │                               │
        Notes / Folders                ┌──────┴──────┐
                                       │             │
                                  Floating       Note Sheet
                                  Toolbar            │
                                       │       ┌──────┴──────┐
                                       │       │             │
                                    Text/      Drawing      Text
                                    Drawing    Canvas       Layer
                                    Controls                 │
                                                              │
                                                            Tiptap
```

The data architecture is:

```text
Note
│
├── Metadata
│   ├── id
│   ├── title
│   ├── folderId
│   ├── pinned
│   ├── createdAt
│   └── lastEdited
│
└── Pages
    │
    ├── Page
    │   ├── id
    │   ├── text
    │   └── drawing
    │
    ├── Page
    │   ├── id
    │   ├── text
    │   └── drawing
    │
    └── ...
```

The frontend architecture is fundamentally established.

The next immediate task is to fix the current **toolbar → workspace → NoteSheet layout issue**, then implement the actual Tiptap formatting actions.

---

# 68. Consolidated Status Table

| Area | Current Status |
|---|---|
| React frontend | ✅ Working |
| Vite | ✅ Working |
| Sidebar | ✅ Existing |
| Notes | ✅ Working |
| Folders | ✅ Working |
| Note creation | ✅ Working |
| Note deletion | ✅ Working |
| Note duplication | ✅ Working |
| Note title | ✅ Working |
| Multi-page notes | ✅ Working |
| Page creation | ✅ Working |
| Page deletion | ✅ Working |
| Page navigation | ✅ Working |
| Page counter | ✅ Working |
| Page-specific drawing | ✅ Working |
| Drawing mode | ✅ Working |
| Brush size | ✅ Working |
| Brush color | ✅ Working |
| Clear | ✅ Connected |
| Undo | ✅ Connected |
| Redo | ✅ Connected |
| Text editing | ✅ Tiptap integrated |
| Text persistence | ✅ Established in earlier stage |
| Text mode | ✅ Working |
| Tiptap toolbar | ✅ Working |
| Floating toolbar | ✅ Working |
| Text toolbar UI | ✅ Working |
| Bold/Italic/etc. actions | ⏳ Not connected |
| Responsive canvas | ✅ Established |
| LocalStorage | ✅ Established |
| Workspace sizing | ⚠️ Needs refinement |
| NoteSheet after toolbar integration | ❌ Current issue |
| Toolbar/sheet layout | ❌ Current issue |
| Zoom/pan | ❌ Not implemented |
| Images/shapes/eraser | ❌ Not implemented |
| Backend persistence | ❌ Not implemented |

---

# 69. One-Line Project Summary

> **A React-based multi-page digital notebook with page-specific drawing and Tiptap text editing, persistent note/folder management, and a floating mode-aware toolbar, currently undergoing workspace layout refinement.**
