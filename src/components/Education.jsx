import { motion, useInView } from 'framer-motion';
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="education" className="py-28 md:py-36 px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent-light text-sm font-medium tracking-widest uppercase mb-3">
            Education & Certifications
          </p>
          <h2 className="section-heading">Background</h2>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {education.map((edu, i) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="glass-card p-6 hover:border-white/10 transition-all duration-300"
            >
              <GraduationCap size={20} className="text-accent-light mb-4" />
              <h3 className="text-white font-semibold text-sm">{edu.degree}</h3>
              <p className="text-gray-400 text-sm mt-1">{edu.institution}</p>
              <p className="text-gray-600 text-xs mt-2">{edu.year}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6 hover:border-white/10 transition-all duration-300"
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
      </div>
    </section>
  );
}
