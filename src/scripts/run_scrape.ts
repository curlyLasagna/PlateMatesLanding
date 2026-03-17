import { scrapeNutrients } from './scrapeNutrients';

const glenURL = 'https://towson.mydininghub.com/en/location/fresh-food-company-at-glen-dining-hall#7095';

console.log('Starting nutrient scrape for Towson Dining...');
scrapeNutrients(glenURL).then(() => {
  console.log('Scraping process finished.');
}).catch((err) => {
  console.error('Scraping failed:', err);
});
