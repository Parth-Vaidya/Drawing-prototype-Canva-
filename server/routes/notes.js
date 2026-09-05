import { Router } from "express";

const router = Router();

const notes = [
    {
        id:1,
        title: "My First Note",
        content: "Learning backend development"
    },
    {
        id:2,
        title: "Notebook App",
        content: "Build the REST API"
    }
];

//get req
router.get("/", (req, res) => {
    // res.send("Hello from notes route");
    res.json({
        "status": "success",
        data: notes
    });

});


//get note by its id
router.get("/:id", (req, res) => {
    // res.send(`Here is your note with id: ${req.params.id}`);
    const id=Number(req.params.id);

    const note=notes.find(note=>note.id===id);

    //if note is not found
    if(!note){
        return res.status(404).json({
            status: "fail",
            message: "Note not found"
        });
    }

    //if note is found
    res.status(200).json({
        status: "success",
        data: note
    });
});


//add note 
router.post("/", (req, res) => {
    // you will get title or content from req and keep this note in notes
    const {title,content} = req.body;
    // const title = req.body.title;
    // const content = req.body.content; same as above line

    if(!title || !content){
        return res.status(400).json({
            status: "fail",
            message: "title and content are required"
        });
    }

    const newNote = {
        id: notes.length + 1,
        title,
        content
    };

    notes.push(newNote);

    res.ststus(201).json({
        status: "success",
        data: newNote
    });

});

//update the  a note by id
router.patch("/:id",(req,res)=>{
    const id=Number(req.params.id);
    const note=notes.find(note=>note.id===id);

    if(!note){
        return res.status(404).json({
            status: "fail",
            meassage: "Note not found"
        });
    }

    const {title,content}=req.body;

    if(title != undefined){
        note.title=title;
    }

    if(content != undefined){
        note.content = content;
    }

    res.status(200).json({
        status: "success",
        data: note
    });

});


//put req
// router.put("/:id", (req, res) => {
//     if (!req.body.title || !req.body.content) {
//         return res.status(400).send("Missing data");
//     }
//     res.send(`Here is your note with id: ${req.params.id} updated`);

// });


//Delete req
router.delete("/:id", (req, res) => {
    const id=Number(req.params.id);

    const noteIndex=notes.findIndex(note=>note.id===id); //if note is not found then it will return -1

    if(noteIndex===-1){
        return res.status(404).json({
            status: "fail",
            message: "Note not found"
        });
    }

    const deletedNote=notes.splice(noteIndex,1); //removes one note from notes array and returns the deleted note

    return res.status(200).json({
        status: "success",
        data: deletedNote
    });
});

export default router;