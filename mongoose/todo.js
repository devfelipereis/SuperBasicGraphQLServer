import mongoose from "mongoose";

const Schema = mongoose.Schema;

const toDoSchema = new Schema({
  id: Number,
  description: String,
  completed: Boolean
}, {collection: "TodoList"});

const ToDo = mongoose.model('ToDo', toDoSchema);

export default ToDo;