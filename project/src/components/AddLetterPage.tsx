import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Send, Upload, Image } from 'lucide-react';
import { supabase, User } from '../lib/supabase';

interface AddLetterPageProps {
  onNavigate: (page: string) => void;
}

export default function AddLetterPage({ onNavigate }: AddLetterPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // BEGINNER NOTE: These new states handle photo uploads from your device
  const [photoFile, setPhotoFile] = useState<File | null>(null); // Stores the photo you select
  const [photoPreview, setPhotoPreview] = useState<string>(''); // Shows a preview of your photo
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload'); // Which method you're using

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setUsers(data || []);
      if (data && data.length > 0) {
        setSelectedAuthor(data[0].id);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  // BEGINNER NOTE: This function runs when you select a photo from your device
  // It creates a preview so you can see the photo before uploading
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Check file size (max 5MB for better performance)
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo must be smaller than 5MB');
        return;
      }

      setPhotoFile(file); // Save the file
      setError('');

      // Create a preview URL so you can see the photo
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // BEGINNER NOTE: This function uploads the photo to Supabase Storage
  // It returns the public URL of the uploaded photo
  const uploadPhoto = async (file: File): Promise<string> => {
    // Create a unique filename using timestamp and random number
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = fileName;

    // Upload the file to Supabase Storage bucket
    const { error: uploadError } = await supabase.storage
      .from('letter-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get the public URL of the uploaded photo
    const { data } = supabase.storage
      .from('letter-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // BEGINNER NOTE: This function runs when you click "Send Letter with Love"
  // It saves your letter to the database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !message.trim()) {
      setError('Please fill in the title and message');
      return;
    }

    setLoading(true);

    try {
      let finalPhotoUrl = '';

      // STEP 1: Handle photo upload
      if (uploadMethod === 'upload' && photoFile) {
        // If user selected a photo from their device, upload it first
        finalPhotoUrl = await uploadPhoto(photoFile);
      } else if (uploadMethod === 'url' && photoUrl.trim()) {
        // If user entered a photo URL (like from Pexels), use that
        finalPhotoUrl = photoUrl.trim();
      }

      // STEP 2: Save the letter to the database
      const { error: insertError } = await supabase
        .from('letters')
        .insert({
          title: title.trim(),
          message: message.trim(),
          photo_url: finalPhotoUrl || null, // Save the photo URL (uploaded or entered)
          youtube_music_url: youtubeUrl.trim() || null,
          author_id: selectedAuthor
        });

      if (insertError) throw insertError;

      // STEP 3: Go back to home page to see your new letter
      onNavigate('home');
    } catch (error) {
      console.error('Error creating letter:', error);
      setError('Failed to create letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      <div className="floating-hearts">
        <Heart className="heart heart-1" fill="#FFB6C1" color="#FFB6C1" />
        <Heart className="heart heart-2" fill="#DDA0DD" color="#DDA0DD" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to all letters
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 fade-in">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400" fill="#FFB6C1" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Write a Love Letter
            </h1>
            <p className="text-gray-600">
              Share your feelings and create a memory
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* BEGINNER NOTE: This section lets you choose who is writing the letter
                Radio buttons let you pick between Jen or Kat */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Who is writing this letter?
              </label>
              <div className="space-y-2">
                {users.map((user) => (
                  <label key={user.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="author"
                      value={user.id}
                      checked={selectedAuthor === user.id}
                      onChange={(e) => setSelectedAuthor(e.target.value)}
                      className="w-4 h-4 cursor-pointer"
                      required
                    />
                    <span className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: user.color }}
                      />
                      <span className="text-gray-700 font-medium">{user.name}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Letter Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Thinking of You"
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt message here..."
                rows={8}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors resize-none"
                required
              />
            </div>

            {/* BEGINNER NOTE: This section lets you add a photo two ways:
                1. Upload from your device (phone/computer)
                2. Enter a URL (like from Pexels) */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Add a Photo (optional)
              </label>

              {/* Toggle buttons to choose upload method */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod('upload');
                    setPhotoUrl('');
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    uploadMethod === 'upload'
                      ? 'bg-pink-400 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Upload className="inline w-4 h-4 mr-2" />
                  Upload from Device
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod('url');
                    setPhotoFile(null);
                    setPhotoPreview('');
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    uploadMethod === 'url'
                      ? 'bg-pink-400 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Image className="inline w-4 h-4 mr-2" />
                  Enter URL
                </button>
              </div>

              {/* Upload from device option */}
              {uploadMethod === 'upload' && (
                <div>
                  <label className="block w-full cursor-pointer">
                    <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center hover:border-pink-400 transition-colors bg-pink-50/50">
                      {photoPreview ? (
                        <div className="space-y-3">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <p className="text-sm text-gray-600">
                            Click to change photo
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="w-12 h-12 mx-auto text-pink-400" />
                          <div>
                            <p className="text-gray-700 font-medium">
                              Click to select a photo
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                              From your phone or computer (max 5MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Enter URL option */}
              {uploadMethod === 'url' && (
                <div>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://images.pexels.com/photos/..."
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    Tip: Visit pexels.com to find beautiful free photos
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                YouTube Music URL (optional)
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
              />
              <p className="text-gray-500 text-sm mt-2">
                Paste any YouTube video link - it will play automatically when viewing the letter
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-4 rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send size={20} />
                  Send Letter with Love
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
