import { chromium } from 'playwright';
import * as fs from 'fs';

/**
 * This script launches a Chromium instance, intercepts GraphQL GET requests 
 * containing nutrient information, and aggregates them into a structured JSON file.
 */
async function scrapeNutrients(targetUrl: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const nutrientData: any[] = [];

  // Intercept and process responses
  page.on('response', async (response: any) => {
    const url = response.url();
    const request = response.request();

    // Check if it's a GET request and likely contains GraphQL/Nutrient data
    // Most GraphQL over GET uses query parameters for the operationName and variables
    if (request.method() === 'GET' && (url.includes('graphql') || url.includes('nutrient'))) {
      try {
        const contentType = response.headers()['content-type'];
        if (contentType && contentType.includes('application/json')) {
          const json = await response.json();
          
          // Basic check for common nutrient-related fields in the JSON structure
          // This should be refined based on the specific API response structure
          if (json.data || json.nutrients || json.foodNutrients) {
            nutrientData.push({
              url,
              timestamp: new Date().toISOString(),
              data: json
            });
            console.log(`Aggregated nutrient data from: ${url}`);
          }
        }
      } catch (e) {
        // Response might not be valid JSON or already closed
      }
    }
  });

  console.log(`Navigating to ${targetUrl}...`);
  try {
    // Wait for the page to reach network idle state to capture background requests
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Add a small delay for any delayed background requests
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error(`Error during navigation: ${error}`);
  }

  // Save aggregated data
  if (nutrientData.length > 0) {
    const outputPath = './nutrient_aggregation.json';
    fs.writeFileSync(outputPath, JSON.stringify(nutrientData, null, 2));
    console.log(`Successfully saved ${nutrientData.length} responses to ${outputPath}`);
  } else {
    console.log('No matching nutrient GraphQL responses found.');
  }

  await browser.close();
}

export { scrapeNutrients };
