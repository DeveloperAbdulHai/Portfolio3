
import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section id="testimonials" className="py-section bg-surface-muted border-y border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border border-primary-500/25 bg-primary-500/10 text-primary-500 text-[11px] font-semibold tracking-widest uppercase mb-6"
            >
              Client feedback
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-display-xl font-bold text-white tracking-tight"
            >
              What brands say
            </motion.h2>
          </div>
          <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
            Trusted by teams who care about visual impact and clear communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="relative p-8 bg-surface border border-white/[0.06] rounded-2xl hover:border-primary-500/20 transition-colors duration-300"
            >
              <Quote className="absolute top-6 right-6 text-primary-500/10 w-10 h-10" />
              <p className="text-slate-400 mb-6 leading-relaxed relative z-10">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={t.photo_url || 'https://picsum.photos/100/100'}
                  alt={t.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/5"
                />
                <div>
                  <h4 className="font-semibold text-white">{t.name}</h4>
                  <p className="text-sm text-primary-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-primary-500 text-sm font-semibold hover:text-primary-400 transition-colors"
          >
            Join them — start a project
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
