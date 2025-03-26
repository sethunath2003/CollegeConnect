const express = require('express');
const { scrapeHackathons } = require('./scraper');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/hackathons', async (req, res) => {
    try {
        const hackathons = await scrapeHackathons();
        res.json(hackathons);
    } catch (error) {
        res.status(500).send('Error scraping hackathons');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
