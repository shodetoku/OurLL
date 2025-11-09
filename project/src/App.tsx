import { useState, useEffect } from 'react';
import Login from './components/Login';
import HomePage from './components/HomePage';
import LetterPage from './components/LetterPage';
import AddLetterPage from './components/AddLetterPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'letter' | 'add'>('home');
  const [selectedLetterId, setSelectedLetterId] = useState<string>('');

  useEffect(() => {
    // BEGINNER NOTE: This checks if someone shared a letter link
    // If the URL has a letterId parameter, show that letter instead of the home page
    const params = new URLSearchParams(window.location.search);
    const letterId = params.get('letterId');

    if (letterId) {
      // If there's a letter ID in the URL, set it as the selected letter
      setSelectedLetterId(letterId);
      setCurrentPage('letter');
      // Let them view the letter without logging in first (for sharing)
      setIsLoggedIn(true);
    } else {
      // Otherwise, check if they're already logged in
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const handleNavigate = (page: string, letterId?: string) => {
    if (page === 'letter' && letterId) {
      setSelectedLetterId(letterId);
      setCurrentPage('letter');
    } else if (page === 'add') {
      setCurrentPage('add');
    } else {
      setCurrentPage('home');
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentPage === 'letter' && selectedLetterId) {
    return <LetterPage letterId={selectedLetterId} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'add') {
    return <AddLetterPage onNavigate={handleNavigate} />;
  }

  return <HomePage onNavigate={handleNavigate} onLogout={handleLogout} />;
}

export default App;
