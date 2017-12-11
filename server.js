import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { graphql } from 'graphql'
import graphqlHTTP from 'express-graphql';
import ToDo from './mongoose/todo';
import schema from './graphql/Schema/Schema';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/SuperBasicGraphQLServer');
const db = mongoose.connection;

db.on('error', () => {console.log('Failed to connect to mongoose')});
db.once('open', () => {console.log('Connected to mongoose')})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/todos', async (req, res) => {
  const toDoItem = new ToDo({
    id: 1,
    description: req.body.description,
    completed: false
  });

  try {
    const saveResult = await toDoItem.save();
    console.log('toDoItem saved successfully', saveResult);
  } catch (error) {
    console.log('toDoItem save failed', error);
  }

  res.redirect('/');
});

app.use('/graphql', graphqlHTTP(req => ({
  schema
})));

// let's start the server
app.listen(3000, () => { console.log('Server is running!') });