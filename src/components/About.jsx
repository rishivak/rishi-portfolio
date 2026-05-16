import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Server, Database, Cloud } from 'lucide-react';

const highlights = [
  { icon: Server, label: 'Backend', desc: 'Java, Spring Boot, Microservices' },
  { icon: Code2, label: 'Frontend', desc: 'React, Angular, TypeScript' },
  { icon: Database, label: 'Databases', desc: 'MySQL, Redis,MongoDB, Oracle, ElasticSearch' },
  { icon: Cloud, label: 'Cloud & DevOps', desc: 'AWS, Azure, Docker, CI/CD' },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-28 md:py-36 px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent-light text-sm font-medium tracking-widest uppercase mb-3">
            About
          </p>
          <h2 className="section-heading">A bit about me</h2>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-5"
          >
            <p className="text-gray-400 leading-relaxed">
              Certified Fullstack Software Developer with over 6 years of experience
              specializing in backend development, particularly in architecting, designing,
              and implementing highly scalable microservices using Java and Spring Boot.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Strong advocate of Clean Code principles and Test Driven Development (TDD),
              ensuring high-quality code and efficient development processes. Experienced in
              the complete software development lifecycle — from design and architecture
              to deployment and monitoring.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Currently at <span className="text-white font-medium">S&P Global</span> as
              a Senior Software Engineer, working on complex data extraction products leveraging AI, NLP,
              and microservices architecture.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="glass-card p-5 hover:border-white/10 transition-all duration-300"
              >
                <Icon size={20} className="text-accent-light mb-3" />
                <h3 className="text-white text-sm font-semibold">{label}</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
