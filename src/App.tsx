import MainView from './components/MainView';
import { DataProvider } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';

function AppContent() {
  const { goHome } = useNavigation();

  return (
    <DataProvider>
      <LanguageProvider>
        <div className="container">
          <header className="flex items-center justify-between mb-8">
            <button 
              onClick={goHome}
              aria-label="Go to Home"
              title="Return to Home"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
              }}
            >
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="arcGradient" x1="2" y1="16" x2="30" y2="16" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1D9E75" />
                    <stop offset="1" stopColor="#378ADD" />
                  </linearGradient>
                </defs>
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="url(#arcGradient)">
                  <path d="M 4 28 C 8 -2, 28 -2, 28 18" />
                  <path d="M 4 28 C 7 8, 22 6, 22 18" />
                  <path d="M 4 28 C 6 16, 16 12, 16 18" />
                </g>
              </svg>
              <h2 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em' }}>Circl</h2>
            </button>
            <div className="flex flex-wrap flex-col md:flex-row items-end md:items-center gap-4 md:gap-4">
              <p className="text-secondary md:mr-2" style={{ fontSize: '0.875rem' }}>Privacy-first Local Processing</p>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </header>

          <MainView />
        </div>
      </LanguageProvider>
    </DataProvider>
  );
}

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;
