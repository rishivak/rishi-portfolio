import { motion, useInView } from 'framer-motion';
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="py-28 md:py-36 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.05)_0%,_transparent_50%)]" />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent-light text-sm font-medium tracking-widest uppercase mb-3">
            Skills
          </p>
          <h2 className="section-heading">Technical expertise</h2>
          <p className="section-subheading">
            Proficient across the full stack with deep expertise in backend architecture.
          </p>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="glass-card p-6 hover:border-white/10 transition-all duration-300"
            >
              <h3 className="text-white text-sm font-semibold mb-4">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] text-gray-400 border border-white/[0.06]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
