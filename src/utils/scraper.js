const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWebsite(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const scrapedData = [];

        // Example scraping logic: modify according to the website structure
        $('h1').each((index, element) => {
            scrapedData.push({
                title: $(element).text(),
                link: url
            });
        });

        return scrapedData;
    } catch (error) {
        console.error('Error scraping the website:', error);
        throw error;
    }
}

module.exports = {
    scrapeWebsite
};