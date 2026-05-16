import { motion, useInView } from 'framer-motion';
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="py-28 md:py-36 px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent-light text-sm font-medium tracking-widest uppercase mb-3">
            Experience
          </p>
          <h2 className="section-heading">Where I&apos;ve worked</h2>
        </motion.div>

        <div className="mt-14 relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.06] hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="relative md:pl-12"
              >
                <div className="hidden md:flex absolute left-0 top-1 w-[15px] h-[15px] rounded-full bg-dark-950 border-2 border-accent/50 items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>

                <div className="glass-card p-6 md:p-8 hover:border-white/10 transition-all duration-300">
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
