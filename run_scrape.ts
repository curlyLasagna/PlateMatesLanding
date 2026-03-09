import { scrapeNutrients } from './src/scrapeNutrients';

const url = 'https://towson.mydininghub.com/en/location/fresh-food-company-at-glen-dining-hall#7095';

console.log('Starting nutrient scrape for Towson Dining...');
scrapeNutrients(url).then(() => {
  console.log('Scraping process finished.');
}).catch((err) => {
  console.error('Scraping failed:', err);
});
