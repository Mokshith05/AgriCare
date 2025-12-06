import type { EncyclopediaArticle } from '@/lib/types';

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

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}
