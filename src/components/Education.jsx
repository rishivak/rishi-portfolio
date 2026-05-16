import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Award, Languages } from 'lucide-react';

const education = [
  {
    degree: 'MBA (Finance)',
    institution: 'Jaipur National University (JNU)',
    year: '2021',
  },
  {
    degree: 'B.Tech (ECE)',
    institution: 'B.K. Birla Institute of Engineering and Technology, Pilani',
    year: '2016',
  },
];

const certifications = [
  'Software AG Certified webMethods.io Integration Associate',
  'Software AG Certified API Management Associate',
];

export default function Education() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section id="education" ref={sectionRef} className="py-32 md:py-44 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.04)_0%,_transparent_50%)]" />

      <motion.div style={{ scale, opacity }} className="max-w-6xl mx-auto relative z-10">
        <div>
          <p className="text-accent-light text-sm font-medium tracking-widest uppercase mb-3">
            Education & Certifications
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Background
          </h2>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {education.map((edu, i) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
              className="glass-card p-6 transition-all duration-300 cursor-default"
            >
              <GraduationCap size={20} className="text-accent-light mb-4" />
              <h3 className="text-white font-semibold text-sm">{edu.degree}</h3>
              <p className="text-gray-400 text-sm mt-1">{edu.institution}</p>
              <p className="text-gray-600 text-xs mt-2">{edu.year}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
            className="glass-card p-6 transition-all duration-300 cursor-default"
          >
            <Award size={20} className="text-accent-light mb-4" />
            <h3 className="text-white font-semibold text-sm mb-3">Certifications</h3>
            <ul className="space-y-2">
              {certifications.map((cert) => (
                <li key={cert} className="flex gap-2 text-gray-400 text-xs leading-relaxed">
                  <span className="text-accent/50 mt-0.5 shrink-0">▸</span>
                  {cert}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-white/[0.04]">
              <div className="flex items-center gap-2">
                <Languages size={14} className="text-gray-600" />
                <span className="text-gray-500 text-xs">English</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
