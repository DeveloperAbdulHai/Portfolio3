
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

const ContactPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.from('profile').select('*').maybeSingle().then(({ data }) => {
      if (data) setProfile(data);
    });
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pt-32">
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default ContactPage;
