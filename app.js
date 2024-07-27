const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); 
const app = express();

app.use(cors())


mongoose.connect("mongodb://localhost:27017/todos_database", {
});

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    
});

const Todo = mongoose.model("Todo", todoSchema);


 
app.use(bodyParser.json());



app.get('/todos',async function(req,res)
{
    try{
   const todos = await Todo.find()
   res.json(todos)
    }
    catch(error)
    {
        console.log("servor error !")
    }
})



app.post('/todos', async function (req, res) {
    try {
        const newTodo = new Todo({
            title: req.body.title,
            description: req.body.description
        });
        await newTodo.save();
        res.status(200).json(newTodo);
    } catch (error) {
        res.status(400).send("Bad Request");
    }
});

app.put("/todos/:id",async function(req,res)
{
    const id = (req.params.id)

    const {title,description}= req.body;

    const updatetodo = await Todo.findByIdAndUpdate(id,
        {$set:{title :title ,description : description}},
        {new: true, runValidators: true}
    )

    if(updatetodo)
    {
        res.status(200).json(
            {
                status: "sucessfully updated:",
                todo: updatetodo
            }
        )
    }
    else
    {
       res.status(200).json(
        {
            status:"uncessfully",
            msg : "Todos is not presnt:"
        }
       )
    }
})



app.delete("/todos/:id", async function(req,res)
{
    const index = await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({
        msg:"Deleted sucessfully",
        todos:index
    })

    if(!index)
    {
        res.status(404).json({
            status: "unsucess",
            todos : "Todos is not present in Database:"
        })
    } 
})

let port_number = 3000;

app.listen(port_number, function() {
    console.log(`Listening on port ${port_number}`);
});

