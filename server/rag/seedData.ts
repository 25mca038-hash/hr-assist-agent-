import { Candidate, JobDescription, HRPolicy } from '../types';

export const SEED_CANDIDATES: Candidate[] = [
  {
    id: 'cand-001',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+1 (555) 234-5678',
    location: 'Seattle, WA (Open to Remote)',
    summary:
      'Accomplished Full-Stack & Cloud Engineer with 5+ years of experience designing high-throughput web architectures, microservices, and modern React/TypeScript user interfaces. Proven track record in CI/CD pipeline modernization and distributed database optimization.',
    education: [
      {
        degree: 'Master of Computer Applications (MCA)',
        institution: 'National Institute of Technology',
        year: '2019 - 2021',
        details: 'Graduated with Honors; Specialization in Distributed Systems & Cloud Architecture.',
      },
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Science & Tech',
        year: '2016 - 2019',
        details: 'Dean’s List, GPA 3.9/4.0',
      },
    ],
    skills: [
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Redis',
      'AWS (ECS, Lambda, S3)',
      'Docker',
      'Kubernetes',
      'GraphQL',
      'Tailwind CSS',
      'CI/CD (GitHub Actions)',
      'Jest',
    ],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'CloudSphere Solutions',
        duration: '2022 - Present',
        responsibilities: [
          'Architected and delivered customer-facing dashboard in React 18 and Node.js serving 120,000+ active enterprise users.',
          'Reduced API latency by 42% through strategic caching with Redis and query optimization on PostgreSQL.',
          'Spearheaded transition of monolithic backend services into containerized microservices managed via Kubernetes.',
          'Mentored 4 junior and mid-level software engineers on test-driven development and clean code practices.',
        ],
      },
      {
        title: 'Full-Stack Developer',
        company: 'Apex Media Technologies',
        duration: '2020 - 2022',
        responsibilities: [
          'Engineered responsive SPAs using React, Redux, and Tailwind CSS.',
          'Designed RESTful APIs using Express and integrated third-party payment and auth webhooks.',
          'Configured automated deployment pipelines using Docker and GitHub Actions, shrinking deployment cycle times by 65%.',
        ],
      },
    ],
    certifications: [
      'AWS Certified Solutions Architect – Associate (2023)',
      'Certified Kubernetes Application Developer (CKAD) (2024)',
    ],
    projects: [
      {
        name: 'Enterprise Workflow Automation Engine',
        technologies: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'Docker'],
        description:
          'Created an asynchronous job queue and monitoring visualizer handling 2M+ daily events with real-time WebSocket progress alerts.',
      },
      {
        name: 'Scalable E-Commerce Analytics Platform',
        technologies: ['React', 'Next.js', 'Tailwind CSS', 'GraphQL'],
        description:
          'Built high-performance dashboard analyzing user clickstream conversions with server-side rendering and interactive data graphs.',
      },
    ],
    achievements: [
      'Awarded Engineering Excellence Award at CloudSphere Solutions in Q3 2023.',
      'Authored popular open-source React state management utility with 1,800+ GitHub stars.',
    ],
    rawText: `PRIYA SHARMA
Seattle, WA | priya.sharma@example.com | +1 (555) 234-5678 | LinkedIn: priya-sharma-tech

PROFESSIONAL SUMMARY
Accomplished Full-Stack & Cloud Engineer with 5+ years of experience designing high-throughput web architectures, microservices, and modern React/TypeScript user interfaces. Proven track record in CI/CD pipeline modernization and distributed database optimization.

EDUCATION
- Master of Computer Applications (MCA), National Institute of Technology (2019-2021)
  Specialization in Distributed Systems & Cloud Architecture.
- Bachelor of Science in Computer Science, University of Science & Tech (2016-2019)

TECHNICAL SKILLS
Languages & Frameworks: TypeScript, JavaScript, React, Node.js, Express, GraphQL, HTML5, CSS3, Tailwind CSS
Databases & Cache: PostgreSQL, MySQL, Redis, MongoDB
DevOps & Cloud: AWS (ECS, Lambda, S3, RDS), Docker, Kubernetes, GitHub Actions, Terraform
Testing & Tools: Jest, Cypress, Git, Vite, Webpack

PROFESSIONAL EXPERIENCE
Senior Software Engineer | CloudSphere Solutions (2022 - Present)
- Architected and delivered customer-facing dashboard in React 18 and Node.js serving 120,000+ active enterprise users.
- Reduced API latency by 42% through strategic caching with Redis and query optimization on PostgreSQL.
- Spearheaded transition of monolithic backend services into containerized microservices managed via Kubernetes.
- Mentored 4 junior and mid-level software engineers on test-driven development and clean code practices.

Full-Stack Developer | Apex Media Technologies (2020 - 2022)
- Engineered responsive SPAs using React, Redux, and Tailwind CSS.
- Designed RESTful APIs using Express and integrated third-party payment and auth webhooks.
- Configured automated deployment pipelines using Docker and GitHub Actions, shrinking deployment cycle times by 65%.

CERTIFICATIONS
- AWS Certified Solutions Architect – Associate (2023)
- Certified Kubernetes Application Developer (CKAD) (2024)

KEY PROJECTS
- Enterprise Workflow Automation Engine (TypeScript, Node.js, React, PostgreSQL, Docker)
- Scalable E-Commerce Analytics Platform (React, Next.js, Tailwind CSS, GraphQL)

ACHIEVEMENTS
- Awarded Engineering Excellence Award at CloudSphere Solutions in Q3 2023.
- Authored open-source React utility with 1,800+ stars.`,
    fileName: 'Priya_Sharma_Resume.pdf',
    uploadedAt: '2026-03-01T10:15:00Z',
  },
  {
    id: 'cand-002',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 345-6789',
    location: 'San Francisco, CA (Hybrid / Remote)',
    summary:
      'AI & Machine Learning Engineer with 4+ years of hands-on experience building RAG pipelines, fine-tuning large language models, deploying vector search engines, and productionizing predictive ML models using Python, PyTorch, and FastAPI.',
    education: [
      {
        degree: 'Master of Science in Data Science & Artificial Intelligence',
        institution: 'University of California, Berkeley',
        year: '2019 - 2021',
        details: 'Thesis: Efficient Dense Retrieval and Chunk Ranking in Specialized Domains',
      },
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Washington',
        year: '2015 - 2019',
      },
    ],
    skills: [
      'Python',
      'PyTorch',
      'Transformers (Hugging Face)',
      'LangChain',
      'LlamaIndex',
      'FastAPI',
      'ChromaDB',
      'FAISS',
      'Vector Search',
      'Embeddings',
      'Docker',
      'PostgreSQL (pgvector)',
      'Scikit-Learn',
      'MLflow',
      'AWS SageMaker',
    ],
    experience: [
      {
        title: 'Lead AI Engineer',
        company: 'Cognitive Nexus Labs',
        duration: '2022 - Present',
        responsibilities: [
          'Engineered end-to-end RAG system for internal knowledge retrieval across 500,000+ technical legal and financial docs, achieving 94% retrieval precision.',
          'Built custom embedding generation and reranking pipeline using PyTorch and ChromaDB with sub-100ms vector query latencies.',
          'Deployed high-throughput inference APIs using FastAPI and Triton Inference Server on AWS GPU clusters.',
          'Implemented guardrail evaluations and hallucination detection to ensure factuality compliance.',
        ],
      },
      {
        title: 'Machine Learning Engineer',
        company: 'DataFlow Systems',
        duration: '2020 - 2022',
        responsibilities: [
          'Trained and evaluated classification and NLP models using Scikit-Learn and Hugging Face Transformers.',
          'Containerized model training workflows with Docker and tracked experimentation with MLflow.',
          'Created automated data preprocessing scripts handling messy unstructured PDF and text formats.',
        ],
      },
    ],
    certifications: [
      'DeepLearning.AI Generative AI with LLMs (2023)',
      'TensorFlow Developer Certificate (2021)',
    ],
    projects: [
      {
        name: 'OpenRAG: Grounded Multi-Doc QA Engine',
        technologies: ['Python', 'FastAPI', 'PyTorch', 'ChromaDB', 'Transformers'],
        description:
          'Open-source framework providing citation-grounded question answering with dynamic chunk overlap and source attribution.',
      },
      {
        name: 'Semantic Code Search Engine',
        technologies: ['Python', 'FAISS', 'AST Parsing', 'FastAPI'],
        description:
          'Built vector index indexing 50,000+ GitHub repositories to enable natural language queries over codebase architectures.',
      },
    ],
    achievements: [
      'Published research paper in NeurIPS Workshop on Retrieval Augmented Generation (2023).',
      'Speaker at PyData Global 2024 on Production RAG Architecture.',
    ],
    rawText: `ALEX CHEN
San Francisco, CA | alex.chen@example.com | +1 (555) 345-6789 | GitHub: alexchen-ai

SUMMARY
AI & Machine Learning Engineer with 4+ years of hands-on experience building RAG pipelines, fine-tuning large language models, deploying vector search engines, and productionizing predictive ML models using Python, PyTorch, and FastAPI.

EDUCATION
- M.S. Data Science & AI, University of California, Berkeley (2019-2021)
  Thesis: Efficient Dense Retrieval and Chunk Ranking in Specialized Domains
- B.S. Computer Science, University of Washington (2015-2019)

SKILLS
AI/ML: Python, PyTorch, Transformers, Hugging Face, LangChain, LlamaIndex, Scikit-Learn, MLflow
Vector DB & RAG: ChromaDB, FAISS, Pinecone, pgvector, Dense Embeddings, Reranking, Semantic Search
Backend & Cloud: FastAPI, Flask, Docker, Kubernetes, AWS SageMaker, PostgreSQL, Linux

EXPERIENCE
Lead AI Engineer | Cognitive Nexus Labs (2022 - Present)
- Engineered end-to-end RAG system for internal knowledge retrieval across 500,000+ technical legal and financial docs, achieving 94% retrieval precision.
- Built custom embedding generation and reranking pipeline using PyTorch and ChromaDB with sub-100ms vector query latencies.
- Deployed high-throughput inference APIs using FastAPI and Triton Inference Server on AWS GPU clusters.
- Implemented guardrail evaluations and hallucination detection to ensure factuality compliance.

Machine Learning Engineer | DataFlow Systems (2020 - 2022)
- Trained and evaluated classification and NLP models using Scikit-Learn and Hugging Face Transformers.
- Containerized model training workflows with Docker and tracked experimentation with MLflow.
- Created automated data preprocessing scripts handling messy unstructured PDF and text formats.

CERTIFICATIONS
- DeepLearning.AI Generative AI with LLMs (2023)
- TensorFlow Developer Certificate (2021)

PROJECTS
- OpenRAG: Grounded Multi-Doc QA Engine (Python, FastAPI, PyTorch, ChromaDB)
- Semantic Code Search Engine (Python, FAISS, AST Parsing, FastAPI)

ACHIEVEMENTS
- Published research paper at NeurIPS Workshop on RAG (2023).
- PyData Global speaker on Production RAG Architecture.`,
    fileName: 'Alex_Chen_Resume.docx',
    uploadedAt: '2026-03-02T14:30:00Z',
  },
  {
    id: 'cand-003',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Austin, TX (Remote)',
    summary:
      'Frontend Specialist & UI Engineer with 3+ years of experience crafting accessible, responsive, and aesthetically distinctive web applications with React, Next.js, and TypeScript. Strong background in design systems and WCAG accessibility standards.',
    education: [
      {
        degree: 'Bachelor of Science in Software Engineering',
        institution: 'University of Texas at Austin',
        year: '2018 - 2022',
      },
    ],
    skills: [
      'React',
      'TypeScript',
      'JavaScript (ES6+)',
      'Next.js',
      'Tailwind CSS',
      'HTML5/CSS3',
      'Figma',
      'Design Systems',
      'WCAG 2.1 AA',
      'Vite',
      'Jest',
      'React Testing Library',
      'Git',
    ],
    experience: [
      {
        title: 'Front-End UI Engineer',
        company: 'Veloce Interactive',
        duration: '2022 - Present',
        responsibilities: [
          'Developed component library in React, TypeScript, and Tailwind CSS adopted by 6 product squads.',
          'Ensured full WCAG 2.1 AA accessibility compliance across consumer portal, resolving 80+ audit flags.',
          'Reduced initial page bundle size by 35% using dynamic code splitting and image optimization.',
        ],
      },
      {
        title: 'Junior Web Developer',
        company: 'CraftUI Agency',
        duration: '2021 - 2022',
        responsibilities: [
          'Translated high-fidelity Figma mockups into responsive pixel-perfect React applications.',
          'Integrated REST APIs and wrote automated unit tests with Jest and React Testing Library.',
        ],
      },
    ],
    certifications: [
      'Meta Front-End Developer Professional Certificate (2022)',
      'Certified Web Accessibility Specialist (WAS) (2023)',
    ],
    projects: [
      {
        name: 'Accessible Enterprise Design System',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Storybook'],
        description:
          'Open-source component library focusing on keyboard navigation, screen reader support, and theme tokens.',
      },
    ],
    achievements: [
      'Awarded Best UI Implementation at Austin Web Dev Summit 2024.',
    ],
    rawText: `SARAH JENKINS
Austin, TX | sarah.jenkins@example.com | +1 (555) 456-7890

SUMMARY
Frontend Specialist & UI Engineer with 3+ years of experience crafting accessible, responsive, and aesthetically distinctive web applications with React, Next.js, and TypeScript. Strong background in design systems and WCAG accessibility standards.

EDUCATION
- B.S. in Software Engineering, UT Austin (2018 - 2022)

SKILLS
Frontend: React, TypeScript, Next.js, JavaScript, Tailwind CSS, HTML5, CSS3, Vite, Storybook
Design & UX: Figma, Design Systems, WCAG 2.1 AA Accessibility, Responsive Design
Testing & Tools: Jest, React Testing Library, Git, npm, ESLint

EXPERIENCE
Front-End UI Engineer | Veloce Interactive (2022 - Present)
- Developed component library in React, TypeScript, and Tailwind CSS adopted by 6 product squads.
- Ensured full WCAG 2.1 AA accessibility compliance across consumer portal, resolving 80+ audit flags.
- Reduced initial page bundle size by 35% using dynamic code splitting and image optimization.

Junior Web Developer | CraftUI Agency (2021 - 2022)
- Translated high-fidelity Figma mockups into responsive pixel-perfect React applications.
- Integrated REST APIs and wrote automated unit tests with Jest and React Testing Library.

CERTIFICATIONS
- Meta Front-End Developer Professional Certificate (2022)
- Certified Web Accessibility Specialist (WAS) (2023)`,
    fileName: 'Sarah_Jenkins_Resume.pdf',
    uploadedAt: '2026-03-03T09:00:00Z',
  },
  {
    id: 'cand-004',
    name: 'David Kumar',
    email: 'david.kumar@example.com',
    phone: '+1 (555) 567-8901',
    location: 'Boston, MA (Open to Relocation)',
    summary:
      'Junior Backend & Database Developer with 1.5 years of industry experience specializing in Python, PostgreSQL, REST API development, and data pipeline scripting. Fast learner with strong analytical foundations.',
    education: [
      {
        degree: 'Bachelor of Technology in Information Technology',
        institution: 'Boston Technological University',
        year: '2020 - 2024',
      },
    ],
    skills: [
      'Python',
      'Django',
      'FastAPI',
      'PostgreSQL',
      'SQLite',
      'SQL Query Optimization',
      'REST APIs',
      'Git',
      'Linux',
      'Docker Basics',
    ],
    experience: [
      {
        title: 'Associate Backend Engineer',
        company: 'DataForge Innovations',
        duration: '2024 - Present',
        responsibilities: [
          'Built internal data ingestion microservices using Python and FastAPI.',
          'Wrote SQL migrations, indexes, and queries on PostgreSQL databases.',
          'Assisted senior engineers in API documentation with OpenAPI/Swagger.',
        ],
      },
    ],
    certifications: [
      'PostgreSQL Certified Associate (2024)',
    ],
    projects: [
      {
        name: 'Inventory Management API',
        technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
        description: 'REST API service for inventory tracking with JWT auth and rate limiting.',
      },
    ],
    achievements: [
      '1st Place in University Annual Hackathon 2023 for Database Optimization Tool.',
    ],
    rawText: `DAVID KUMAR
Boston, MA | david.kumar@example.com | +1 (555) 567-8901

SUMMARY
Junior Backend & Database Developer with 1.5 years of industry experience specializing in Python, PostgreSQL, REST API development, and data pipeline scripting. Fast learner with strong analytical foundations.

EDUCATION
- B.Tech in Information Technology, Boston Technological University (2020 - 2024)

SKILLS
Backend: Python, Django, FastAPI, RESTful APIs, OOP, Data Structures
Databases: PostgreSQL, SQLite, SQL, Relational Modeling, Indexing
Tools: Git, Docker (Basics), Linux, Postman

EXPERIENCE
Associate Backend Engineer | DataForge Innovations (2024 - Present)
- Built internal data ingestion microservices using Python and FastAPI.
- Wrote SQL migrations, indexes, and queries on PostgreSQL databases.
- Assisted senior engineers in API documentation with OpenAPI/Swagger.

PROJECTS
- Inventory Management API (Python, FastAPI, PostgreSQL)
- University Hackathon Winner (2023)`,
    fileName: 'David_Kumar_Resume.pdf',
    uploadedAt: '2026-03-04T11:20:00Z',
  },
];

export const SEED_JOBS: JobDescription[] = [
  {
    id: 'job-001',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Remote / US',
    employmentType: 'Full-time',
    experienceRequired: '4+ years',
    salaryRange: '$140,000 - $175,000 USD',
    summary:
      'We are looking for a Senior Full-Stack Engineer to architect, build, and scale customer-facing web applications. You will collaborate closely with product and infrastructure teams to deliver high-performance user interfaces and resilient backend microservices.',
    responsibilities: [
      'Design, build, and maintain scalable applications using React, TypeScript, and Node.js.',
      'Optimize database queries and schema designs in PostgreSQL and Redis.',
      'Maintain and expand CI/CD workflows and Docker/Kubernetes container infrastructure.',
      'Participate in architecture reviews and mentor fellow software engineers.',
      'Ensure high standards of software quality through automated testing and code reviews.',
    ],
    requiredSkills: [
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'Docker',
      'REST / GraphQL APIs',
      'CI/CD Pipelines',
    ],
    preferredSkills: [
      'Kubernetes',
      'AWS (ECS, Lambda)',
      'Redis Caching',
      'Tailwind CSS',
      'Microservices Architecture',
    ],
    qualifications: [
      'Bachelor’s or Master’s degree in Computer Science, MCA, or equivalent practical experience.',
      '4+ years of professional full-stack development experience.',
      'Proven experience building and maintaining production web applications with 10k+ users.',
    ],
    createdAt: '2026-02-15T08:00:00Z',
    status: 'Active',
  },
  {
    id: 'job-002',
    title: 'Machine Learning & AI Application Engineer',
    department: 'AI & Data Platforms',
    location: 'Remote / US or Hybrid SF',
    employmentType: 'Full-time',
    experienceRequired: '3+ years',
    salaryRange: '$150,000 - $190,000 USD',
    summary:
      'Join our AI engineering team to build generative AI solutions, RAG pipelines, and vector retrieval systems. You will lead the design and implementation of production LLM pipelines, chunking strategies, embeddings, and API services.',
    responsibilities: [
      'Architect and deploy production-grade RAG systems with dense vector search and citation grounding.',
      'Build scalable backend API endpoints using Python and FastAPI for LLM inference and document processing.',
      'Evaluate vector database performance (ChromaDB, FAISS, pgvector) and optimize query latency.',
      'Implement guardrails, factuality validation, and benchmark evaluation suites for AI agents.',
      'Collaborate with product teams to translate business requirements into prompt engineering and tool-calling workflows.',
    ],
    requiredSkills: [
      'Python',
      'PyTorch or TensorFlow',
      'Vector Databases (ChromaDB, FAISS, or Pinecone)',
      'Retrieval-Augmented Generation (RAG)',
      'FastAPI',
      'Embeddings & Semantic Search',
      'Docker',
    ],
    preferredSkills: [
      'LangChain / LlamaIndex',
      'PostgreSQL with pgvector',
      'AWS SageMaker or Cloud GPU Deployment',
      'Transformers & Hugging Face',
      'Experience in HR tech or document extraction',
    ],
    qualifications: [
      'Master’s or Bachelor’s degree in Computer Science, Data Science, Artificial Intelligence, or related field.',
      '3+ years of experience developing machine learning systems or AI-powered backends in Python.',
      'Demonstrated portfolio or research experience in RAG or dense vector retrieval.',
    ],
    createdAt: '2026-02-20T09:30:00Z',
    status: 'Active',
  },
  {
    id: 'job-003',
    title: 'Front-End UI/UX Engineer',
    department: 'Design & Frontend Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    experienceRequired: '2+ years',
    salaryRange: '$110,000 - $135,000 USD',
    summary:
      'We are seeking an empathetic Front-End Engineer who cares deeply about design fidelity, user accessibility, and sleek interface interactions. You will own client-side applications built with React, TypeScript, and modern CSS.',
    responsibilities: [
      'Build responsive web interfaces using React, TypeScript, and Tailwind CSS.',
      'Maintain our shared UI component library and ensure compliance with WCAG 2.1 AA accessibility guidelines.',
      'Partner closely with product designers in Figma to transform prototypes into polished user experiences.',
      'Optimize web performance, Core Web Vitals, and responsive mobile behavior.',
    ],
    requiredSkills: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'HTML5 / Semantic Web',
      'Accessibility (WCAG)',
      'Git',
    ],
    preferredSkills: [
      'Next.js',
      'Storybook',
      'Figma to Code workflows',
      'Jest & React Testing Library',
      'Design Token Systems',
    ],
    qualifications: [
      'Degree in Computer Science, Software Engineering, or equivalent practical portfolio.',
      '2+ years of professional front-end software development experience.',
    ],
    createdAt: '2026-02-25T11:00:00Z',
    status: 'Active',
  },
];

export const SEED_POLICIES: HRPolicy[] = [
  {
    id: 'pol-001',
    title: 'TalentScout Global Recruitment & Structured Interview Guidelines',
    category: 'Interview Conduct',
    version: '2026.1',
    lastUpdated: '2026-01-15',
    summary:
      'Mandatory corporate policy governing structured interviews, candidate evaluation objectivity, blind screening standards, and multi-stage hiring protocols.',
    content: `TALENTSCOUT GLOBAL RECRUITMENT & STRUCTURED INTERVIEW POLICY (HR-2026-01)

1. PURPOSE & SCOPE
This policy sets forth standard, objective, and unbiased recruitment procedures across all departments. All hiring managers, talent acquisition specialists, and interviewers must adhere to these guidelines to ensure fair, equitable, and transparent hiring.

2. STRUCTURED RECRUITMENT STAGES
Recruitment must proceed sequentially through four distinct stages:
Stage 1: Resume Screening & Qualification Verification
- Resumes are evaluated strictly against verified job description criteria (skills, relevant experience, verified qualifications).
- Blind screening principles must be applied: personal identifiers, age, gender, photograph, religion, caste, marital status, or nationality must NEVER influence candidate evaluation.
- No candidate may be automatically rejected solely by an automated algorithm; human recruiter review is required for all final shortlisting.

Stage 2: Technical & Competency Evaluation (45-60 mins)
- Uses standardized, job-specific technical and problem-solving questions.
- Every candidate interviewing for the same job description must be asked equivalent core questions to ensure parity.
- Focus strictly on verified past projects, architectural decision-making, and job-relevant skills.

Stage 3: Behavioral & Values Assessment (STAR Method) (45 mins)
- Questions must follow the STAR framework: Situation, Task, Action, and Result.
- Evaluates collaboration, adaptability, conflict resolution, and communication skills.
- Interviewers must take contemporaneous notes and rate candidates against predefined rubrics (1 = Below Standard, 2 = Progressing, 3 = Meets Expectations, 4 = Exceeds Expectations).

Stage 4: Executive Alignment & Compensation Review
- Hiring manager and HR Business Partner conduct final review.
- Reference checks must be completed within 3 business days of verbal approval.

3. CANDIDATE CONFIDENTIALITY & DATA PROTECTION
- Candidate documents, contact information, and resume details are strictly confidential.
- Personal data may only be stored in authorized HR systems and must not be shared outside the hiring committee.
- Candidates have the right to request deletion of their data in compliance with data privacy regulations.

4. TURNAROUND TIME & CANDIDATE EXPERIENCE
- Recruiter response to submitted applications must occur within 5 business days.
- Interview feedback and next-step notifications must be communicated to the candidate within 48 hours following each interview round.`,
  },
  {
    id: 'pol-002',
    title: 'Compensation Bands, Remote Work Stipends & Notice Period Regulations',
    category: 'Compensation & Benefits',
    version: '2026.2',
    lastUpdated: '2026-02-01',
    summary:
      'Official guidelines for salary benchmarking, remote equipment allowances, probationary milestones, and formal notice period protocols.',
    content: `COMPENSATION BANDS, REMOTE WORK & NOTICE PERIOD POLICY (HR-2026-02)

1. COMPENSATION PHILOSOPHY & EQUAL PAY
- TalentScout maintains transparent, benchmarked salary ranges for all positions based on role scope, geographic market tiers, and demonstrated skill proficiency.
- Offers must strictly fall within the approved range published in the job requisition.
- Negotiations based on previous salary history are strictly prohibited to close legacy gender and demographic pay gaps.

2. REMOTE & HYBRID WORK REGULATIONS
- Roles designated as "Remote" or "Hybrid" are eligible for:
  a. A one-time home office setup stipend of $1,200 USD upon successful onboarding.
  b. A monthly technology, high-speed internet, and cell allowance of $100 USD.
- Employees must maintain a secure, private working space meeting corporate data security specifications.

3. PROBATION PERIOD & MILESTONES
- All new full-time hires undergo a standard 90-day probationary period.
- A 30-day alignment check-in and 60-day performance review are mandatory milestones.
- Confirmation of regular employment is finalized at day 90 following written manager sign-off.

4. NOTICE PERIOD & RESIGNATION PROTOCOLS
- During Probation (First 90 Days):
  Either the employee or the company may terminate employment with 30 calendar days written notice, or payment in lieu thereof.
- Confirmed Full-Time Staff:
  Confirmed employees must provide a standard 60 calendar days written notice period upon resignation.
- Notice Period Buyout:
  Notice period buyouts may only be authorized with joint written approval from the Department Head and Chief People Officer, subject to operational transition readiness.`,
  },
];
