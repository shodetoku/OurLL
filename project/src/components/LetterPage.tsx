import { useEffect, useState } from 'react';
import { Heart, ArrowLeft, Music, Share2, Check } from 'lucide-react';
import { supabase, Letter } from '../lib/supabase';

interface LetterPageProps {
  letterId: string;
  onNavigate: (page: string) => void;
}

export default function LetterPage({ letterId, onNavigate }: LetterPageProps) {
  const [letter, setLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadLetter();
  }, [letterId]);

  const loadLetter = async () => {
    try {
      const { data, error } = await supabase
        .from('letters')
        .select(`
          *,
          users (name, color)
        `)
        .eq('id', letterId)
        .maybeSingle();

      if (error) throw error;
      setLetter(data);
    } catch (error) {
      console.error('Error loading letter:', error);
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

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}` : null;
  };

  // BEGINNER NOTE: This function creates and copies the shareable link
  // The link includes the letter ID so anyone can view this specific letter
  const handleShareLink = () => {
    // Create the shareable URL (includes the letter ID)
    const shareUrl = `${window.location.origin}?letterId=${letterId}`;

    // Copy to clipboard so you can paste it anywhere
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      // Show "Copied!" message for 2 seconds, then hide it
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
        <Heart className="w-16 h-16 text-pink-400 animate-pulse" fill="#FFB6C1" />
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Letter not found</p>
          <button
            onClick={() => onNavigate('home')}
            className="text-pink-500 hover:text-pink-600"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  const embedUrl = letter.youtube_music_url ? getYoutubeEmbedUrl(letter.youtube_music_url) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      <div className="floating-hearts">
        <Heart className="heart heart-1" fill="#FFB6C1" color="#FFB6C1" />
        <Heart className="heart heart-2" fill="#DDA0DD" color="#DDA0DD" />
        <Heart className="heart heart-3" fill="#FFB6C1" color="#FFB6C1" />
        <Heart className="heart heart-4" fill="#FFB6C1" color="#FFB6C1" />
        <Heart className="heart heart-5" fill="#DDA0DD" color="#DDA0DD" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to all letters
          </button>

          {/* BEGINNER NOTE: This button creates a shareable link
              Click it to copy the link to your clipboard */}
          <button
            onClick={handleShareLink}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-105 font-medium"
          >
            {copied ? (
              <>
                <Check size={18} />
                Copied!
              </>
            ) : (
              <>
                <Share2 size={18} />
                Share Link
              </>
            )}
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden fade-in">
          {letter.photo_url && (
            <div className="h-96 overflow-hidden">
              <img
                src={letter.photo_url}
                alt={letter.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 fade-in-up">
                {letter.title}
              </h1>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 fade-in-up" style={{ animationDelay: '0.2s' }}>
                <span
                  className="font-medium text-lg"
                  style={{ color: letter.users?.color || '#FFB6C1' }}
                >
                  From {letter.users?.name || 'Unknown'}
                </span>
                <span>•</span>
                <span>{formatDate(letter.created_at)}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none fade-in-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {letter.message}
              </p>
            </div>

            {embedUrl && (
              <div className="mt-8 fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-2 mb-4 text-gray-700">
                  <Music size={20} className="text-pink-400" />
                  <span className="font-medium">Playing our song...</span>
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    width="100%"
                    height="200"
                    src={embedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="border-0"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
