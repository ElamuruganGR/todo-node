const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

import { Todo } from "./models/Todos";

const app = express();
app.use(express.json());
app.use(cors());

const DEV_DB_CONNECTION = "mongodb://127.0.0.1:27017/todo-mern-no-ts";

console.log("Process.env:", process.env);

// process.env.DB_connection should be provided as env in Heroku
// Heroku env var: 
// DB_CONNECTION:mongodb+srv://Elamurugan_Ravikumar:todonots@clustertodonots.osylvhn.mongodb.net/test
mongoose
  .connect(process.env.DB_CONNECTION || DEV_DB_CONNECTION)
  .then(() => console.log("DB connected"))
  .catch(() => console.error("Mongoose DB Connection failed"));

app.get("/todos", async (_: any, res: any) => {
  Todo.find().then((todos: any) => res.json(todos));
});

app.post("/todos/add", (req: any, res: any) => {
  new Todo({
    text: req.body.text,
  })
    .save()
    .then((x: any) => {
      console.log("Todo is added:", x);
      res.json(x);
    })
    .catch((err: any) => console.log(`Your todo is not added: ${err}`));
});

app.delete("/todos/delete/:id", async(req: any, res: any) => {
  console.log("Deleting");
  
  const todos = await Todo.findByIdAndDelete(req.params.id);
  res.json(todos);
});

app.get("/todos/complete/:id", (req: any, res: any) => {
  Todo.findById(req.params.id)
    .then((x: any) => {
      if (x) x.complete = !x?.complete;
      return x;
    })
    .then((x: any) => {
      x?.save();
      res.json(x);
    })
    .catch((err: any) => {
      console.log("Unable to complete your Todo", err);
    });
});

app.put("/todos/update/:id", async (req: any, res: any) => {
  Todo.findById(req.params.id)
    .then((data: any) => {
      console.log("data found:", data);
      data.text = req.body.text;
      data.complete = req.body.complete;
      data.timestamp = req.body.timestamp;
      data?.save();
      res.json(data);
    })
    .catch((err: any) => console.error("Unable to update your Todo", err));
});

// Heroku by default add its port number in process.env.PORT
app.listen(process.env.PORT || 3001, () => console.log("Server started"));
