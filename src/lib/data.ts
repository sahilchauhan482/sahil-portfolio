// =====================================================================
//  SAHIL — YAHAN APNA SAARA CONTENT EDIT KARO
//  Sirf is file ki values badlo. Baaki code haath lagane ki zarurat nahi.
//  Har project/experience add/remove karna ho toh list me item jodo/hatao.
// =====================================================================

export const site = {
  // Deploy hone ke baad apna final URL yahan daalna (SEO ke liye zaroori)
  url: 'https://sahilchauhan.vercel.app',
  name: 'Sahil Chauhan',
  role: 'Full-Stack Developer',
  // Hero me bade text ke neeche dikhne wali line
  tagline: 'I build robust, scalable web applications end-to-end.',
  location: 'Mohali, Punjab, India',
  email: 'sahilchauhan482@gmail.com',
  phone: '+91 8708634845',
  // Photo: apni photo ko  public/profile.jpg  naam se daal do — bas!
  // File milte hi apne aap dikhne lagegi. Na mile toh placeholder chalega.
  photo: '/profile.jpg',
  resumeUrl: '/resume.pdf', // apna resume /public/resume.pdf me daalo
};

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sahilchauhan-2107a9169', handle: '@sahilchauhan' },
  // GitHub username mila toh yahan sahi kar dena:
  { label: 'GitHub', href: 'https://github.com/', handle: '@your-github' },
  { label: 'Email', href: 'mailto:sahilchauhan482@gmail.com', handle: 'sahilchauhan482@gmail.com' },
];

// Hero ke neeche chalne wale stats (badal sakte ho)
export const stats = [
  { value: '2+', label: 'Years building software' },
  { value: '5+', label: 'Years leading operations' },
  { value: '10+', label: 'Projects shipped' },
];

export const about = {
  heading: 'From logistics floors to production code.',
  // Ye summary resume se banayi hai — freely edit karo
  body: [
    'I am a Full-Stack Developer at Business WebSoft Pvt Ltd, where I build robust web solutions using Angular, .NET and CQRS architecture.',
    'My path is a little different: before writing code full-time, I spent nearly 6 years as a Last-Mile Operations Team Lead at Delhivery, managing complex workflows and large cross-functional teams. That operational discipline now shapes how I ship software — reliable, well-structured, and built to scale.',
    'I trained in .NET at CS Soft Solutions and Softwiz Infotech before moving into full-stack development. I care about clean architecture, thoughtful UX, and code that holds up under real-world load.',
  ],
};

// =====================================================================
//  SKILLS — apne stack ke hisaab se add/remove karo
// =====================================================================
export const skills = [
  {
    group: 'Frontend',
    items: ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'RxJS'],
  },
  {
    group: 'Backend',
    items: ['.NET / C#', 'CQRS', 'REST APIs', 'Entity Framework', 'SQL Server'],
  },
  {
    group: 'Practices & Tools',
    items: ['Full-Stack Development', 'Git', 'Agile', 'Clean Architecture', 'Team Leadership'],
  },
];

// =====================================================================
//  EXPERIENCE — resume se, edit freely
// =====================================================================
export const experience = [
  {
    role: 'Full-Stack Developer',
    company: 'Business WebSoft Pvt Ltd',
    period: 'Nov 2024 — Present',
    location: 'Mohali, India',
    points: [
      'Building robust full-stack web solutions with Angular and .NET.',
      'Applying CQRS architecture to keep read/write concerns clean and scalable.',
      'Collaborating cross-functionally to deliver production features end-to-end.',
    ],
  },
  {
    role: '.NET Trainee',
    company: 'Softwiz Infotech',
    period: 'Mar 2024 — Nov 2024',
    location: 'Mohali, India',
    points: [
      'Built custom software solutions and strengthened .NET fundamentals.',
      'Worked across the stack on client-facing modules.',
    ],
  },
  {
    role: '.NET Trainee',
    company: 'CS Soft Solutions (India) Pvt Ltd',
    period: 'Aug 2023 — Jan 2024',
    location: 'Chandigarh, India',
    points: [
      'Started my software journey — .NET, C#, and web development foundations.',
    ],
  },
  {
    role: 'Last-Mile Operations Team Lead',
    company: 'Delhivery Limited',
    period: 'Aug 2017 — May 2023',
    location: 'India',
    points: [
      'Led last-mile logistics operations for nearly 6 years.',
      'Managed complex workflows, delivery teams, and cross-functional coordination.',
      'Built the operational discipline I now bring to shipping reliable software.',
    ],
  },
];

// =====================================================================
//  PROJECTS — YE PLACEHOLDERS HAIN. Apne real projects se replace karo.
//  Har project ke liye: title, description, tech, links, aur optional image.
//  Image: /public/projects/ me daalo aur path yahan do (e.g. '/projects/app.jpg')
// =====================================================================
export const projects = [
  {
    title: 'Enterprise Web Platform',
    description:
      'A full-stack business platform built with Angular and .NET using CQRS. Handles complex workflows with clean separation of read and write models. (Placeholder — apne real project se badlo.)',
    tech: ['Angular', '.NET', 'CQRS', 'SQL Server'],
    image: '', // e.g. '/projects/platform.jpg'
    live: '#',
    github: '#',
    featured: true,
  },
  {
    title: 'Logistics Ops Dashboard',
    description:
      'Real-time dashboard concept for last-mile delivery tracking — inspired by my operations background. Live status, route load, and team performance. (Placeholder.)',
    tech: ['Angular', 'TypeScript', 'REST API', 'Charts'],
    image: '',
    live: '#',
    github: '#',
    featured: true,
  },
  {
    title: 'Task & Workflow Manager',
    description:
      'A clean task management app with role-based access and activity streams. Demonstrates end-to-end full-stack delivery. (Placeholder.)',
    tech: ['.NET', 'Angular', 'Entity Framework'],
    image: '',
    live: '#',
    github: '#',
    featured: false,
  },
  {
    title: 'This Portfolio',
    description:
      'A 3D animated portfolio built with Next.js, React-Three-Fiber and Framer Motion. Server-rendered and SEO-optimised.',
    tech: ['Next.js', 'React Three Fiber', 'Framer Motion', 'Tailwind'],
    image: '',
    live: '#',
    github: '#',
    featured: false,
  },
];

export const education = [
  {
    degree: 'Bachelor of Arts (BA)',
    school: 'Kurukshetra University (KUK)',
    period: '',
  },
];
