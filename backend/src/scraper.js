const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeHackathons() {
    const url = 'https://reskilll.com/allhacks';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const hackathons = [];

    $('.hackathonCard').each((index, element) => {
        const hackathon = {};
        hackathon.image = $(element).find('img').attr('src');
        hackathon.name = $(element).find('.eventName').text().trim();
        hackathon.link = $(element).find('.eventName').attr('href');
        hackathon.description = $(element).find('.eventDescription').text().trim();
        hackathon.registrationStart = $(element).find('.hackresgiterdate').eq(0).text().trim();
        hackathon.registrationEnd = $(element).find('.hackresgiterdate').eq(1).text().trim();
        hackathon.registrationStatus = $(element).find('.registerevent').text().trim();
        hackathons.push(hackathon);
    });

    return hackathons;
}

module.exports = { scrapeHackathons };
