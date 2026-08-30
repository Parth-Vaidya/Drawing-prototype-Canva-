import { Router } from "express";

const router = Router();


//get req
router.get("/", (req, res) => {
    res.send("Hello from notes route");
    // res.json({
    //     "message": "Notes API is working",
    //     "status": "success"
    // });

});

router.get("/:id", (req, res) => {
    res.send(`Here is your note with id: ${req.params.id}`);
});


//post req
router.post("/add", (req, res) => {
    if (!req.body.title || !req.body.content) {
        return res.status(400).send("Missing data");
    }
    res.send("Hello from notes route post request");

});


//put req
router.put("/:id", (req, res) => {
    if (!req.body.title || !req.body.content) {
        return res.status(400).send("Missing data");
    }
    res.send(`Here is your note with id: ${req.params.id} updated`);

});


//delete req
//if you want to delete single note, thne us put/patch method for it 
// delete is very delicate method use API key for it
router.delete("/", (req, res) => {
    res.send(`Your notes deleted`);
});

export default router;