const notes = require('express').Router();
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);

    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
    console.info(`${req.method} request received to create note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid()
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote
        };

        res.json(response);
    }

    else {
        res.json('Error in posting note');
    }
});

notes.delete('/:id', (req, res) => {
    console.info(`${req.method} request received to delete note`);

    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((data) => {
        const id = req.params.id;
        const filterNotes = data.filter((notes) => notes.id !== id);
        const deleteNote = data.filter((notes) => notes.id === id);

        writeToFile('./db/db.json', filterNotes);

        const response = {
            status: 'deleted',
            body: deleteNote
        };

        res.json(response);
    });
});

module.exports = notes;
