
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);

  if (!isStarted) {
    return <LandingPage onStart={() => setIsStarted(true)} />;
  }

  return <Dashboard onHome={() => setIsStarted(false)} />;
};

export default App;
