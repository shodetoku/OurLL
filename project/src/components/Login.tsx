import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  // BEGINNER NOTE: This function checks if the passcode is correct
  // When user submits the form, it compares what they typed with the secret passcode
  // If correct, it saves "isLoggedIn" in browser memory and shows the home page
  // If wrong, it shows an error message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // HOW TO CHANGE THE PASSCODE:
    // Simply change '070925' below to your new passcode
    // For example: if (passcode === 'MyNewCode123') {
    // Keep the quotes around the passcode!
    if (passcode === '070925') {
      localStorage.setItem('isLoggedIn', 'true');
      onLogin();
    } else {
      setError('Wrong passcode. Try again!');
      setPasscode('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100">
      <div className="floating-hearts">
        <Heart className="heart heart-1" fill="#FFB6C1" color="#FFB6C1" />
        <Heart className="heart heart-2" fill="#DDA0DD" color="#DDA0DD" />
        <Heart className="heart heart-3" fill="#FFB6C1" color="#FFB6C1" />
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 fade-in">
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 mx-auto mb-4 text-pink-400" fill="#FFB6C1" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Love Letters</h1>
          <p className="text-gray-600">A special place just for us</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Enter Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
              placeholder="Type the secret passcode"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-105"
          >
            Unlock Our Memories
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Hint: our anniversary
        </p>
      </div>
    </div>
  );
}
