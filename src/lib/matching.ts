import { supabase } from './supabase';
import { UserProfile } from '../types/user';

interface MatchScore {
  userId: string;
  score: number;
}

export async function findMatches(user: UserProfile, limit: number = 10): Promise<UserProfile[]> {
  // Get users within preferences
  const { data: potentialMatches } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', user.id)
    .in('gender', user.preferences.gender)
    .gte('age', user.preferences.age_range[0])
    .lte('age', user.preferences.age_range[1]);

  if (!potentialMatches) return [];

  const scores: MatchScore[] = potentialMatches.map((match) => ({
    userId: match.id,
    score: calculateMatchScore(user, match)
  }));

  // Sort by score and get top matches
  scores.sort((a, b) => b.score - a.score);
  const topMatchIds = scores.slice(0, limit).map(s => s.userId);

  // Get full profiles for top matches
  const { data: matches } = await supabase
    .from('profiles')
    .select('*')
    .in('id', topMatchIds);

  return matches as UserProfile[] || [];
}

function calculateMatchScore(user1: UserProfile, user2: UserProfile): number {
  let score = 0;

  // Interest matching (30% of total score)
  const sharedInterests = user1.interests.filter(i => user2.interests.includes(i));
  score += (sharedInterests.length / Math.max(user1.interests.length, user2.interests.length)) * 30;

  // Hobby matching (20% of total score)
  const sharedHobbies = user1.hobbies.filter(h => user2.hobbies.includes(h));
  score += (sharedHobbies.length / Math.max(user1.hobbies.length, user2.hobbies.length)) * 20;

  // Personality compatibility (30% of total score)
  const personalityScore = calculatePersonalityCompatibility(
    user1.personality_traits,
    user2.personality_traits
  );
  score += personalityScore * 30;

  // Location proximity (20% of total score)
  const distance = calculateDistance(
    user1.location.latitude,
    user1.location.longitude,
    user2.location.latitude,
    user2.location.longitude
  );
  const distanceScore = Math.max(0, 1 - (distance / user1.preferences.distance));
  score += distanceScore * 20;

  return score;
}

function calculatePersonalityCompatibility(
  traits1: Record<string, number>,
  traits2: Record<string, number>
): number {
  const traitKeys = Object.keys(traits1);
  if (traitKeys.length === 0) return 0;

  const differences = traitKeys.map(trait => {
    const diff = Math.abs(traits1[trait] - traits2[trait]);
    return 1 - (diff / 4); // Normalize to 0-1 range
  });

  return differences.reduce((sum, diff) => sum + diff, 0) / traitKeys.length;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}