// Import Express.js Router
const notes = require('express').Router();
// Helper functions for reading and writing to the JSON file
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');
// Helper function to generate unique ids
const uuid = require('../helpers/uuid');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
    // Log that a GET request was received
    console.info(`${req.method} request received for notes`);

    // Read the data from the JSON file and parse it as the response
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for creating a new note
notes.post('/', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to create note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id: uuid()
        };

        // Read the data from the JSON file and append the new note
        readAndAppend(newNote, './db/db.json');

        // Variable for the object indicating the new note fields and that it was successfully added
        const response = {
            status: 'success',
            body: newNote
        };

        // Log the note that was added in the response
        res.json(response);
    }

    // Log an error if there was a problem creating a new note
    else {
        res.json('Error in posting note');
    }
});

// DELETE Route for deleting an existing note
notes.delete('/:id', (req, res) => {
    // Log that a DELETE request was received
    console.info(`${req.method} request received to delete note`);

    // Read the data from the JSON file and parse it to be used
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((data) => {
        // Get the id parameter from the request
        const id = req.params.id;
        // Filter out only the id that matches and save the rest
        const filterNotes = data.filter((notes) => notes.id !== id);
        // Filter out all the ids that don't match - not necessary, but we will use this for our response
        const deleteNote = data.filter((notes) => notes.id === id);

        // Save the filtered notes to the JSON file
        writeToFile('./db/db.json', filterNotes);

        // Variable for the object indicating the note fields and that it was deleted
        const response = {
            status: 'deleted',
            body: deleteNote
        };

        // Log the note that was deleted in the response
        res.json(response);
    });
});

// Export the package
module.exports = notes;
