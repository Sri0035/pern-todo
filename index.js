const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
//while receiving data from the client, we need to parse it into json
app.use(express.json());


//Creating routes//

// Create a todo
app.post("/todos", async(req, res) =>{
    try {
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);
        res.json(newTodo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }   
})

//get all todos 
app.get("/todos", async(req, res) =>{
    try {
        const allTodos = await pool.query("SELECT * FROM todo")
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message);
    }
})

//get a todos
app.get("/todos/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        const todo_req = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo_req.rows[0]);
        
    } catch (error) {
        console.error(error);
    }
})

//update a todo
app.put("/todos/:id", async(req, res)=>{
    const {id} = req.params;
    const {description} = req.body;
    const update_todo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", 
        [description, id]
    );
    res.json("todo updated!!");
})

//delete a todo
app.delete("/todos/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        const delete_todo = await pool.query("DELETE FROM todo WHERE todo_id = $1", 
            [id]
        );
        res.json("Todo deleted!!");
    } catch (error) {
        console.error(error.message);
    }
})



app.listen(5000, ()=>{
    console.log("Server has started on port 5000");
})