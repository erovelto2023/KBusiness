
export interface Program {
  id: string;
  name: string;
  category: string;
  commission: string;
  platform: string;
  description: string;
  image?: string;
  sales?: number;
  earned?: number;
  isFavorite?: boolean;
}

export interface AffiliateLink {
  id: string;
  programName: string;
  link: string;
  notes?: string;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  route?: string; // Optional route for navigation
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Benefit {
  id: string;
  text: string;
}
