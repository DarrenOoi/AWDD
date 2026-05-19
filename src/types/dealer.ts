export type Dealer = {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  website: string;
  phone: string;
  instagram: string;
  brands: string[];
  googleRating?: number;
  reviewCount?: number;
  featured: boolean;
  heroImage: string;
};
