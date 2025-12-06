import type { EncyclopediaArticle, PreventiveCare } from '@/lib/types';

export const ENCYCLOPEDIA_ARTICLES: EncyclopediaArticle[] = [
  {
    id: '1',
    slug: 'blight-disease',
    title: 'Blight Disease',
    category: 'Disease',
    description: 'A common plant disease caused by a fungus-like organism, leading to rapid browning and death of plant tissues.',
    symptoms: ['Dark, water-soaked spots on leaves', 'White mold on the underside of leaves', 'Rapid wilting and browning'],
    prevention: ['Ensure good air circulation', 'Water at the base of the plant', 'Use resistant crop varieties'],
    treatment: ['Remove and destroy infected plants', 'Apply copper-based fungicides', 'Use neem oil spray as an organic option'],
    imageId: 'blight-disease',
  },
  {
    id: '2',
    slug: 'powdery-mildew',
    title: 'Powdery Mildew',
    category: 'Disease',
    description: 'A fungal disease that affects a wide variety of plants, appearing as white powdery spots on leaves and stems.',
    symptoms: ['White, powdery patches on leaves', 'Yellowing of leaves', 'Distorted shoots'],
    prevention: ['Plant in sunny locations', 'Avoid over-fertilization', 'Prune for air circulation'],
    treatment: ['Spray with a solution of baking soda and water', 'Apply horticultural oils', 'Use potassium bicarbonate-based fungicides'],
    imageId: 'powdery-mildew',
  },
  {
    id: '3',
    slug: 'aphids-infestation',
    title: 'Aphids Infestation',
    category: 'Pest',
    description: 'Small, sap-sucking insects that can multiply quickly, causing damage to plants and transmitting diseases.',
    symptoms: ['Clusters of small insects on new growth', 'Sticky "honeydew" on leaves', 'Curled or distorted leaves'],
    prevention: ['Introduce beneficial insects like ladybugs', 'Regularly inspect plants', 'Use reflective mulches'],
    treatment: ['Spray with a strong jet of water', 'Apply insecticidal soap', 'Use neem oil to disrupt their life cycle'],
    imageId: 'aphids-infestation',
  },
  {
    id: '4',
    slug: 'rust-fungus',
    title: 'Rust Fungus',
    category: 'Disease',
    description: 'Plant diseases caused by pathogenic fungi of the order Pucciniales, known for causing rust-colored pustules on plants.',
    symptoms: ['Orange, yellow, or brown pustules on leaves', 'Powdery spores on infected surfaces', 'Premature leaf drop'],
    prevention: ['Choose resistant varieties', 'Avoid overhead watering', 'Sanitize garden tools'],
    treatment: ['Remove infected foliage', 'Apply sulfur or copper-based fungicides', 'Improve air circulation'],
    imageId: 'rust-fungus',
  },
];

export const PREVENTIVE_CARE_TIPS: PreventiveCare[] = [
    {
        id: '1',
        crop: 'Tomatoes',
        tips: [
            {
                title: 'Proper Spacing',
                description: 'Plant tomato seedlings at least 24-36 inches apart to ensure good air circulation, which helps prevent fungal diseases like blight.'
            },
            {
                title: 'Consistent Watering',
                description: 'Water deeply and at the base of the plant to avoid wetting the foliage. Inconsistent watering can lead to blossom-end rot.'
            },
            {
                title: 'Mulching',
                description: 'Apply a layer of organic mulch (like straw or wood chips) to conserve moisture, suppress weeds, and prevent soil-borne diseases from splashing onto leaves.'
            }
        ]
    },
    {
        id: '2',
        crop: 'Leafy Greens (Spinach, Lettuce)',
        tips: [
            {
                title: 'Crop Rotation',
                description: 'Avoid planting leafy greens in the same spot year after year to prevent the buildup of soil pests and diseases.'
            },
            {
                title: 'Shade in Hot Weather',
                description: 'Provide partial shade during the hottest parts of the day to prevent bolting (premature flowering) and scorched leaves.'
            },
            {
                title: 'Monitor for Pests',
                description: 'Regularly check for aphids and cabbage worms. Hand-pick larger pests or use insecticidal soap for smaller ones.'
            }
        ]
    },
    {
        id: '3',
        crop: 'Peppers & Eggplants',
        tips: [
            {
                title: 'Support and Staking',
                description: 'Provide stakes or cages to support the plants as they grow heavy with fruit. This keeps fruit off the ground and improves air circulation.'
            },
            {
                title: 'Fertilize Appropriately',
                description: 'Use a balanced, low-nitrogen fertilizer. Too much nitrogen can encourage lush foliage at the expense of fruit production.'
            },
            {
                title: 'Watch for Bacterial Spot',
                description: 'Avoid working with plants when they are wet to prevent the spread of bacterial diseases. Use copper-based sprays as a preventive measure if needed.'
            }
        ]
    }
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}
