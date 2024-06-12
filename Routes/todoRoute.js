const router = require("express").Router();
const pool = require('../db')


router.post("/post/todos", async(req,res)=>{
    try {
        const {description}= req.body;
        const newtodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *",[description])
      

        res.json(newtodo.rows[0])

        
    } catch (error) {
        console.error(error.message)
        
    }

})

router.get("/get/todos",async(req,res)=>{
    try {
        const alltodo = await pool.query("SELECT * FROM todo");
        res.json(alltodo.rows)
        
    } catch (error) {
        console.error(error.message)
        
    }
})

router.put("/todos/:id",async(req,res)=>{
   
    try {
        const {id} = req.params;
        const {description}=req.body;
        const updatedtodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2",[description,id]);
        res.json("Todo has been Updated !");
        
    } catch (error) {
        console.error(error.message)
        
    }
   
})

router.delete("/todos/:id",async(req,res)=>{
    try {
        const {id}=req.params;
        await pool.query("DELETE FROM todo WHERE todo_id = $1",[id]);
        res.json("Todo has been DELETED !");
        
    } catch (error) {
        console.error(error.message)
        
    }
})

module.exports=router;