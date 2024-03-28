// Load environment variables from .env file
require('dotenv').config();



// Import necessary modules
const express = require('express');
const axios = require('axios'); // For making HTTP requests
const cors = require('cors'); // Import the cors middleware
const corsPermissions = require('./cors'); // Import the corsPermissions middleware
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // Use PORT environment variable if available, otherwise default to 3000

const corsOptions = {
    origin: 'http://127.0.0.1:3000',
    optionsSuccessStatus: 200
}

const OpenAI = require("openai");
// Use the API key
const apiKey = process.env.OPENAI_API_KEY;

// Initialize OpenAI with the API key
const openaiInstance = new OpenAI({ apiKey });



app.use(express.static(path.join(__dirname, 'public')));


// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(corsPermissions.permission); // Use the corsPermissions middleware
app.use(express.json()); // Parse JSON bodies in requests

// Route handling for other routes


// Route for retrieving Google Maps API key
app.get('/api/maps-api-key', cors(corsOptions), (req, res) => {
    // Return the Google Maps API key stored in environment variables
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

// Route for calculating route between two locations
app.post('/calculate-route', cors(corsOptions), async (req, res) => {
    // Extract origin and destination from request body
    const { origin, destination } = req.body;
    // Retrieve Google Maps API key from environment variables
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    // Construct API URL for directions
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        // Make a GET request to Google Directions API using Axios
        const response = await axios.get(apiUrl); // Remove { mode: 'no-cors' }
        // Send back the entire response or part of it depending on your need
        res.json(response.data);
    } catch (error) {
        // Handle errors if request fails
        res.status(500).json({ error: 'Failed to fetch directions' });
    }
});

// Endpoint to fetch places of interest
app.get('/places', async (req, res) => {
    // Get query parameters from the request, e.g., location, radius, etc.
    const { location, radius } = req.query;

    // Retrieve Google Maps API key from environment variables
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // Construct the URL for the Google Places API request
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&key=${apiKey}`;

    try {
        // Fetch data from Google Places API using Axios
        const response = await axios.get(apiUrl);
        const placesData = response.data;
        res.json(placesData); // Respond to HTTP request with JSON data
    } catch (error) {
        // Handle errors, e.g., if the API request fails
        console.error('Error fetching places data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Define endpoint to fetch coordinates using Google Geocoding API
app.get('/api/geocode', async (req, res) => {
    try {
        const location = req.query.location;
        const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Fetch the API key from environment variables

        // Construct the URL for the Google Geocoding API request
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;

        // Make a GET request to the Google Geocoding API
        const response = await axios.get(apiUrl);

        // Extract latitude and longitude from the API response
        const data = response.data;
        if (data.status === "OK") {
            const { lat, lng } = data.results[0].geometry.location;
            res.json({ lat, lng }); // Send the coordinates as JSON in the response
        } else {
            res.status(400).json({ error: "Geocoding API request failed" });
        }
    } catch (error) {
        console.error("Failed to fetch coordinates:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Endpoint to interact with OpenAI
app.post('/openai-interaction', async (req, res) => {
    try {
        const { prompt } = req.body;
        // Make a request to OpenAI using the prompt
        const response = await openaiInstance.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo",
        });

        // Send the response from OpenAI back to the client
        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error('Error interacting with OpenAI:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

