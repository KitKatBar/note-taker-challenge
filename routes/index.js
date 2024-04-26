// Import Express.js Router
const router = require('express').Router();

// Import our modular router for /notes
const notesRouter = require('./notes');

// Define the route to our notes
router.use('/notes', notesRouter);

// Export the router
module.exports = router;
