/** Unsplash professional portraits — used for all generated speakers */
export const SPEAKER_PHOTOS: string[] = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c0d5e0e8e8?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&sat=-50', // variant
];

/** Get speaker photo URL by index (cycles through pool) */
export function getSpeakerPhoto(index: number): string {
  return SPEAKER_PHOTOS[index % SPEAKER_PHOTOS.length];
}
