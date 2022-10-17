const notesRouter = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

const notesArr = require('../db/db.json');

notesRouter.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notesRouter.post('/', (req, res) => {
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
        title,
        text,
        id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 📝`);
  } else {
    res.error('Error in adding note');
  }
});

notesRouter.delete('/:id', (req, res) => { 
  if (req.params.id) {
      console.info(`${req.method} request received to delete a note`);
      const noteId = req.params.id;
      for (let i = 0; i < notesArr.length; i++) {
        const currentNote = notesArr[i];
        if (currentNote.id === noteId) {
            // removes 1 note from note array at given index
            notesArr.splice(i, 1);
            writeToFile('./db/db.json', notesArr);
            res.status(`You have successfully deleted ${currentNote}`);
            return;
        }
      }
        res.status(404).send('Note not found');
    } else {
        res.status(400).send('Note ID not provided');
    }
  });

module.exports = notesRouter;