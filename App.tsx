
import React, { useState, useEffect, createContext, useContext, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundLights from './components/BackgroundLights';
import CustomCursor from './components/CustomCursor';

// Lazy loading pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const Blog = React.lazy(() => import('./pages/Blog'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// Standard Loading Component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center">
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        ease: "easeInOut" 
      }}
      className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full shadow-[0_0_20px_rgba(0,208,132,0.2)]"
    />
    <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 animate-pulse">Syncing Experience</p>
  </div>
);

// Wrapper for route transitions
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
};

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDark(false);
    else setIsDark(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <HashRouter>
        <CustomCursor />
        <BackgroundLights />
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/services" element={<PageTransition><ServicesPage /></PageTransition>} />
              <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
              <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
              <Route path="/admin" element={session ? <Navigate to="/dashboard" /> : <PageTransition><AdminLogin /></PageTransition>} />
              <Route path="/dashboard/*" element={session ? <PageTransition><Dashboard /></PageTransition> : <Navigate to="/admin" />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </HashRouter>
      <Toaster position="bottom-right" />
    </ThemeContext.Provider>
  );
};

export default App;
