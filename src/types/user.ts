export interface UserProfile {
  id: string;
  created_at: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  photos: string[];
  height?: number;
  body_type?: string;
  occupation?: string;
  hobbies: string[];
  interests: string[];
  personality_traits: Record<string, number>;
  verified: boolean;
  last_active: string;
  preferences: {
    gender: ('male' | 'female' | 'non-binary' | 'other')[];
    age_range: [number, number];
    distance: number;
  };
}