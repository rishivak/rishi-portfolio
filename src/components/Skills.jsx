import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const skillCategories = [
  {
    title: 'Languages',
    skills: ['Java', 'J2EE', 'PL/SQL', 'JavaScript', 'TypeScript'],
  },
  {
    title: 'Frameworks',
    skills: ['Spring Boot', 'Spring MVC', 'Spring Cloud', 'Hibernate', 'Angular', 'React'],
  },
  {
    title: 'Architecture',
    skills: ['Microservices', 'RESTful APIs', 'Event-Driven', 'TDD', 'Clean Code'],
  },
  {
    title: 'Databases',
    skills: ['MySQL', 'Redis', 'Oracle', 'ElasticSearch'],
  },
  {
    title: 'Cloud & DevOps',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Git'],
  },
  {
    title: 'Messaging & Monitoring',
    skills: ['JMS', 'Kafka', 'ActiveMQ', 'DataDog', 'Splunk', 'Grafana'],
  },
];

export default function Skills() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section id="skills" ref={sectionRef} className="py-32 md:py-44 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.05)_0%,_transparent_50%)]" />

      <motion.div style={{ scale, opacity }} className="max-w-6xl mx-auto relative z-10">
        <div>
          <p className="text-accent-light text-sm font-medium tracking-widest uppercase mb-3">
            Skills
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Technical expertise
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl">
            Proficient across the full stack with deep expertise in backend architecture.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, borderColor: 'rgba(255,255,255,0.15)' }}
              className="glass-card p-6 transition-all duration-300 cursor-default"
            >
              <h3 className="text-white text-sm font-semibold mb-4">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] text-gray-400 border border-white/[0.06] hover:border-accent/20 hover:text-accent-light transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
