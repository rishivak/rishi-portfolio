import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const experiences = [
  {
    role: 'Senior Software Engineer — FullStack',
    company: 'S&P Global',
    division: 'Market Intelligence',
    location: 'India',
    period: 'Sept 2024 — Present',
    points: [
      'Working on complex business DataExtraction product utilizing Java, Spring Boot, and microservices.',
      'Enhanced the predictive analytical language processing model using NLP techniques to extract accurate data, significantly improving efficiency metrics.',
      'Implemented ETL processes for data pre-processing, transforming documents into XML format for seamless integration with real-time data consumption systems.',
      'Optimized server-side processing and integrated ActiveMQ for message brokering, enabling asynchronous communication between microservices.',
      'Integrated APM tools like DataDog and Grafana for in-depth performance diagnostics. Leveraged SQL optimization techniques including indexing and query refactoring.',
      'Implemented AWS Secrets Manager for secure credential management. Designed Azure DevOps pipelines for microservices deployment with Docker and Kubernetes.',
    ],
  },
  {
    role: 'Sr. Application Engineer II — FullStack',
    company: 'Covalience',
    location: 'Chandigarh, India',
    period: 'Jan 2023 — Aug 2024',
    points: [
      'Experienced in design, development, and implementation of server-side Java and J2EE development using Spring RESTful APIs.',
      'Contributed to the architecture and implementation of critical features, optimizing SQL queries and procedures.',
      'Built scalable and resilient microservices, created CI/CD pipelines, and managed Dockerization.',
      'Proficient in front-end and back-end development with Angular framework, JavaScript, and jQuery.',
    ],
  },
  {
    role: 'Software Engineer — Java',
    company: 'Innovatechs Technology Solutions',
    location: 'Hyderabad, India',
    period: 'Jan 2020 — Jan 2023',
    points: [
      'Engineered WebMethods using Java and J2EE technologies, specializing in optimizing system performance.',
      'Developed RESTful APIs using Java, J2EE, Hibernate, Spring Boot, Spring Security, and Amazon S3.',
      'Developed, mapped, and transformed XML to EDI documents for seamless data exchange using FTP and reverse invocation servers.',
      'Configured JDBC Adapter for databases and migrating patches between development environments through Pub-Sub model.',
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section id="experience" ref={sectionRef} className="py-32 md:py-44 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(99,102,241,0.04)_0%,_transparent_50%)]" />

      <motion.div style={{ scale, opacity }} className="max-w-6xl mx-auto relative z-10">
        <div>
          <p className="text-accent-light text-sm font-medium tracking-widest uppercase mb-3">
            Experience
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Where I&apos;ve worked
          </h2>
        </div>

        <div className="mt-16 relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/30 via-white/[0.06] to-transparent hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative md:pl-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.12 + 0.2 }}
                  className="hidden md:flex absolute left-0 top-1 w-[15px] h-[15px] rounded-full bg-dark-950 border-2 border-accent/50 items-center justify-center"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </motion.div>

                <motion.div
                  whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
                  className="glass-card p-6 md:p-8 transition-all duration-300 cursor-default"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-base">{exp.role}</h3>
                      <p className="text-accent-light text-sm mt-0.5">
                        {exp.company}
                        {exp.division && <span className="text-gray-500"> · {exp.division}</span>}
                        <span className="text-gray-600"> · {exp.location}</span>
                      </p>
                    </div>
                    <span className="text-gray-500 text-xs font-medium shrink-0 sm:mt-1">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-2.5">
                    {exp.points.map((point, j) => (
                      <li key={j} className="flex gap-3 text-gray-400 text-sm leading-relaxed">
                        <span className="text-accent/50 mt-1.5 shrink-0">▸</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
