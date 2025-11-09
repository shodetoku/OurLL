import { useEffect, useState } from 'react';
import { Heart, Plus, LogOut } from 'lucide-react';
import { supabase, Letter, User } from '../lib/supabase';

interface HomePageProps {
  onNavigate: (page: string, letterId?: string) => void;
  onLogout: () => void;
}

export default function HomePage({ onNavigate, onLogout }: HomePageProps) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      const { data, error } = await supabase
        .from('letters')
        .select(`
          *,
          users (name, color)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLetters(data || []);
    } catch (error) {
      console.error('Error loading letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      <div className="floating-hearts">
        <Heart className="heart heart-1" fill="#FFB6C1" color="#FFB6C1" />
        <Heart className="heart heart-2" fill="#DDA0DD" color="#DDA0DD" />
        <Heart className="heart heart-3" fill="#FFB6C1" color="#FFB6C1" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12 fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-12 h-12 text-pink-400" fill="#FFB6C1" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Our Love Letters
            </h1>
            <Heart className="w-12 h-12 text-purple-400" fill="#DDA0DD" />
          </div>
          <p className="text-gray-600 text-lg">
            Every memory, every moment, captured with love
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => onNavigate('add')}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <Plus size={20} />
            Write New Letter
          </button>

          <button
            onClick={onLogout}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto mb-4 text-pink-400 animate-pulse" fill="#FFB6C1" />
            <p className="text-gray-600">Loading our memories...</p>
          </div>
        ) : letters.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl">
            <Heart className="w-16 h-16 mx-auto mb-4 text-pink-300" />
            <p className="text-gray-600 text-lg mb-4">No letters yet</p>
            <p className="text-gray-500">Start by writing your first love letter!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {letters.map((letter, index) => (
              <div
                key={letter.id}
                onClick={() => onNavigate('letter', letter.id)}
                className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {letter.photo_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={letter.photo_url}
                      alt={letter.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {letter.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {letter.message}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="font-medium"
                      style={{ color: letter.users?.color || '#FFB6C1' }}
                    >
                      From {letter.users?.name || 'Unknown'}
                    </span>
                    <span className="text-gray-500">
                      {formatDate(letter.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
