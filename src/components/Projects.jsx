import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Brain, Building2, HeartPulse, ChevronLeft, ChevronRight } from 'lucide-react';
import foreseerImg from '../assets/foreseer.png';
import foreseer2Img from '../assets/foreseer2.png';
import doeImg from '../assets/DOE.png';
import doe1Img from '../assets/DOE1.png';
import doe2Img from '../assets/doe2.png';
import healthcareImg from '../assets/plan4healthcare.png';
import healthcare2Img from '../assets/plan4healthcare2.png';

const projects = [
  {
    icon: Brain,
    title: 'Foreseer - AI Data Extraction Platform',
    company: 'S&P Global · Market Intelligence',
    description:
      'Enterprise-scale AI platform leveraging NLP and machine learning to extract structured information from unstructured financial documents. The core extractor model is now deployed across 11 data-driven projects, reducing manual workforce by 70% while significantly improving accuracy and processing efficiency. Built with Java, Spring Boot, and a resilient microservices architecture using ActiveMQ for async communication, ETL pipelines for data transformation, and DataDog/Grafana for real-time performance monitoring. Secured with AWS Secrets Manager and deployed via Azure DevOps CI/CD pipelines with Docker and Kubernetes.',
    tags: ['Java', 'Spring Boot', 'NLP', 'ActiveMQ', 'AWS', 'Docker', 'Kubernetes', 'ETL', 'DataDog'],
    images: [foreseerImg, foreseer2Img],
    highlight: true,
    stats: [
      { label: 'Projects Using Model', value: '11' },
      { label: 'Manual Work Reduced', value: '70%' },
      { label: 'Architecture', value: 'Microservices' },
    ],
  },
  {
    icon: HeartPulse,
    title: 'Plan4HealthCare',
    company: 'Govt. Healthcare Platform · Covalience',
    description:
      'Full-stack government healthcare financial platform enabling real-time budget estimation and management for government medical hospitals. Designed end-to-end modules for budgeting workflows, financial reporting, and resource allocation. Built with Spring Boot backend, Angular frontend, and Hibernate ORM with MySQL, serving multiple hospital departments with role-based access control and audit logging.',
    tags: ['Java', 'Spring Boot', 'Hibernate', 'MySQL', 'Angular', 'REST APIs'],
    images: [healthcareImg, healthcare2Img],
  },
  {
    icon: Building2,
    title: 'DOE - Abu Dhabi Energy Licensing',
    company: 'Department of Energy · Innovatechs',
    description:
      'Government B2B licensing platform for the Abu Dhabi Department of Energy, enabling secure licensing of energy plants with multi-level authentication and authorization. Engineered RESTful APIs with Java, J2EE, Hibernate, and Spring Security. Implemented complex XML-to-EDI data transformations for seamless inter-organization data exchange via FTP and reverse invocation servers. Configured JDBC adapters and managed environment migrations through the Pub-Sub model.',
    tags: ['Java', 'J2EE', 'Spring Security', 'REST APIs', 'XML/EDI', 'Hibernate', 'FTP'],
    images: [doeImg, doe1Img, doe2Img],
  },
];

function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-5 group/carousel">
      <img
        src={images[current]}
        alt="Project screenshot"
        className="w-full h-full object-cover transition-transform duration-500 group-hover/carousel:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent" />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((p) => (p - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-dark-950/60 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-200"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setCurrent((p) => (p + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-dark-950/60 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-200"
          >
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === current ? 'bg-white w-4' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section id="projects" ref={sectionRef} className="py-32 md:py-44 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.04)_0%,_transparent_60%)]" />

      <motion.div style={{ scale, opacity }} className="max-w-6xl mx-auto relative z-10">
        <div>
          <p className="text-accent-light text-sm font-medium tracking-widest uppercase mb-3">
            Projects
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            What I&apos;ve built
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl">
            Enterprise-grade platforms powering government and financial operations.
          </p>
        </div>

        {/* Featured project — full width */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6, borderColor: 'rgba(255,255,255,0.15)' }}
          className="mt-16 glass-card p-6 md:p-8 transition-all duration-300 group cursor-default"
        >
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <ImageCarousel images={projects[0].images} />
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-accent/10">
                  <Brain size={20} className="text-accent-light" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{projects[0].title}</h3>
                  <p className="text-accent-light/70 text-xs">{projects[0].company}</p>
                </div>
                <span className="ml-auto text-[10px] px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                  CURRENT
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {projects[0].description}
              </p>

              {projects[0].stats && (
                <div className="flex gap-4 mt-5">
                  {projects[0].stats.map((stat) => (
                    <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-center flex-1">
                      <p className="text-white font-bold text-lg">{stat.value}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-5">
                {projects[0].tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] text-gray-500 border border-white/[0.04]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other projects — grid */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {projects.slice(1).map((project, i) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, borderColor: 'rgba(255,255,255,0.15)' }}
                className="glass-card p-6 md:p-8 transition-all duration-300 group flex flex-col cursor-default"
              >
                {project.images.length > 0 && (
                  <ImageCarousel images={project.images} />
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-accent/10">
                    <Icon size={20} className="text-accent-light" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">{project.title}</h3>
                    <p className="text-accent-light/70 text-xs">{project.company}</p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] text-gray-500 border border-white/[0.04]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
