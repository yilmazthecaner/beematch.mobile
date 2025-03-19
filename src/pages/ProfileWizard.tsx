import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import { useToast } from '../components/ui/use-toast';
import { UploadButton } from '../components/UploadButton';

const profileSchema = z.object({
  height: z.number().min(100).max(250),
  bodyType: z.enum(['athletic', 'average', 'slim', 'curvy', 'muscular', 'other']),
  occupation: z.string().min(2).max(100),
  hobbies: z.array(z.string()).min(3),
  interests: z.array(z.string()).min(3),
  personalityTraits: z.record(z.number().min(1).max(5)),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const HOBBIES_OPTIONS = [
  'Reading', 'Writing', 'Gaming', 'Cooking', 'Travel',
  'Photography', 'Music', 'Sports', 'Art', 'Dancing',
  'Hiking', 'Yoga', 'Movies', 'Technology', 'Fashion'
];

const PERSONALITY_TRAITS = [
  'Outgoing', 'Creative', 'Analytical', 'Empathetic',
  'Adventurous', 'Organized', 'Patient', 'Ambitious'
];

export default function ProfileWizard() {
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useStore((state) => state.user);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          photos,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully!'
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
          
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Photos</h2>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                  >
                    {photos[i] ? (
                      <img
                        src={photos[i]}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <UploadButton
                        onUploadComplete={(url) => {
                          setPhotos(prev => {
                            const newPhotos = [...prev];
                            newPhotos[i] = url;
                            return newPhotos;
                          });
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={photos.length < 1}
                className="w-full mt-4 py-2 px-4 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Height (cm)</label>
                <input
                  type="number"
                  {...register('height', { valueAsNumber: true })}
                  className="w-full p-2 border rounded-md"
                />
                {errors.height && (
                  <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Body Type</label>
                <select
                  {...register('bodyType')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select body type</option>
                  <option value="athletic">Athletic</option>
                  <option value="average">Average</option>
                  <option value="slim">Slim</option>
                  <option value="curvy">Curvy</option>
                  <option value="muscular">Muscular</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Occupation</label>
                <input
                  type="text"
                  {...register('occupation')}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hobbies (select at least 3)</label>
                <div className="grid grid-cols-3 gap-2">
                  {HOBBIES_OPTIONS.map((hobby) => (
                    <label key={hobby} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={hobby}
                        {...register('hobbies')}
                      />
                      <span>{hobby}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Personality Traits</label>
                <div className="grid gap-4">
                  {PERSONALITY_TRAITS.map((trait) => (
                    <div key={trait}>
                      <label className="block text-sm mb-1">{trait}</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        {...register(`personalityTraits.${trait}` as any, { valueAsNumber: true })}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Complete Profile
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}