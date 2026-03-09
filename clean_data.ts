import * as fs from 'fs';

/**
 * Reads the aggregated nutrient data and extracts only the entree name 
 * and its associated nutrients into a cleaner, structured JSON.
 */
function cleanNutrientData() {
  const inputPath = './nutrient_aggregation.json';
  const outputPath = './nutrient_aggregation.json';

  if (!fs.existsSync(inputPath)) {
    console.error(`Input file ${inputPath} not found.`);
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const cleanedData: any[] = [];
  const seenSkus = new Set<string>();

  for (const response of rawData) {
    const data = response.data?.data;
    if (!data) continue;

    // Look for products in getLocationRecipes or similar structures
    const products = data.getLocationRecipes?.products?.items || 
                     data.products?.items || 
                     (data.Search_variants ? [data.Search_variants] : []);

    if (products && Array.isArray(products)) {
      for (const item of products) {
        if (item.name && item.attributes && !seenSkus.has(item.sku)) {
          const nutrients: any = {};
          const nutrientFields = [
            'calories', 'protein', 'total_carbohydrates', 'total_fat', 
            'saturated_fat', 'trans_fat', 'cholesterol', 'sodium', 
            'dietary_fiber', 'sugars'
          ];

          item.attributes.forEach((attr: any) => {
            if (nutrientFields.includes(attr.name)) {
              nutrients[attr.name] = parseFloat(attr.value);
            }
          });

          // Only add if we found some nutrients
          if (Object.keys(nutrients).length > 0) {
            cleanedData.push({
              name: item.name,
              sku: item.sku,
              nutrients
            });
            seenSkus.add(item.sku);
          }
        }
      }
    }
    
    // Also handle direct SearchVariants responses if they exist in the noise
    if (data.Search_variants?.variants) {
        for (const variant of data.Search_variants.variants) {
            const product = variant.product;
            if (product && product.name && !seenSkus.has(product.sku)) {
                const nutrients: any = {};
                product.attributes?.forEach((attr: any) => {
                    if (['calories', 'protein', 'total_carbohydrates', 'total_fat'].includes(attr.name)) {
                        nutrients[attr.name] = parseFloat(attr.value);
                    }
                });
                if (Object.keys(nutrients).length > 0) {
                    cleanedData.push({
                        name: product.name,
                        sku: product.sku,
                        nutrients
                    });
                    seenSkus.add(product.sku);
                }
            }
        }
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2));
  console.log(`Cleaned data saved. Extracted ${cleanedData.length} unique entrees.`);
}

cleanNutrientData();
