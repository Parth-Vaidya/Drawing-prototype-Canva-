import express from "express";

const router = express.Router();


//get req
router.get("/", (req,res)=>{
    res.send("Hello from notes route");
});

router.get("/:id", (req,res)=>{
    res.send(`Here is your note with id: ${req.params.id}` );
});


//post req
router.post("/", (req,res)=>{
    if(!req.body){
        res.status(404).send("No note found,Post request failed");
    }
    res.send("Hello from notes route post request");

});


//put req
router.put("/:id", (req,res)=>{
    if(!req.body){
        res.status(404).send("No note found,Put request failed");
    }
    res.send(`Here is your note with id: ${req.params.id} updated`);

});


//delete req
router.delete("/:id", (req,res)=>{
    if(!req.body){
        res.status(404).send("No note found,Delete request failed");
    } 
    res.send(`Here is your note with id: ${req.params.id} deleted`);
  
});

export default router;