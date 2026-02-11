
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Services from '../components/Services';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Profile, Service } from '../types';

const ServicesPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, s] = await Promise.all([
          supabase.from('profile').select('*').maybeSingle(),
          supabase.from('services').select('*')
        ]);
        if (p.data) setProfile(p.data);
        if (s.data) setServices(s.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pt-32">
        <Services services={services} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default ServicesPage;
