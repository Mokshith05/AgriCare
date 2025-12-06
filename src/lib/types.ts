export type EncyclopediaArticle = {
  id: string;
  slug: string;
  title: string;
  category: 'Disease' | 'Pest';
  description: string;
  symptoms: string[];
  prevention: string[];
  treatment: string[];
  imageId: string;
};

export type PreventiveCare = {
  id: string;
  crop: string;
  tips: {
    title: string;
    description: string;
  }[];
};

export type LogEntry = {
  id: string;
  date: string;
  activity: string;
  notes: string;
};
