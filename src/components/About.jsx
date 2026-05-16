import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Server, Database, Cloud } from 'lucide-react';

const highlights = [
  { icon: Server, label: 'Backend', desc: 'Java, Spring Boot, Microservices' },
  { icon: Code2, label: 'Frontend', desc: 'React, Angular, TypeScript' },
  { icon: Database, label: 'Databases', desc: 'MySQL, Redis,MongoDB, Oracle, ElasticSearch' },
  { icon: Cloud, label: 'Cloud & DevOps', desc: 'AWS, Azure, Docker, CI/CD' },
];

export default function About() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section id="about" ref={sectionRef} className="py-32 md:py-44 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.04)_0%,_transparent_50%)]" />

      <motion.div style={{ scale, opacity }} className="max-w-6xl mx-auto relative z-10">
        <div>
          <p className="text-accent-light text-sm font-medium tracking-widest uppercase mb-3">
            About
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            A bit about me
          </h2>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-16">
          <div className="space-y-5">
            <p className="text-gray-400 text-base leading-relaxed">
              Certified Fullstack Software Developer with over 6 years of experience
              specializing in backend development, particularly in architecting, designing,
              and implementing highly scalable microservices using Java and Spring Boot.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              Strong advocate of Clean Code principles and Test Driven Development (TDD),
              ensuring high-quality code and efficient development processes. Experienced in
              the complete software development lifecycle — from design and architecture
              to deployment and monitoring.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              Currently at <span className="text-white font-medium">S&P Global</span> as
              a Senior Software Engineer, working on complex data extraction products leveraging AI, NLP,
              and microservices architecture.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {highlights.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
                className="glass-card p-5 transition-all duration-300 cursor-default"
              >
                <Icon size={20} className="text-accent-light mb-3" />
                <h3 className="text-white text-sm font-semibold">{label}</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
