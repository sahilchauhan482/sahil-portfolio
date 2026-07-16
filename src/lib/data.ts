// =====================================================================
//  SAHIL — YAHAN APNA SAARA CONTENT EDIT KARO
//  Sirf is file ki values badlo. Baaki code haath lagane ki zarurat nahi.
//  Har project/experience add/remove karna ho toh list me item jodo/hatao.
// =====================================================================

export const site = {
  // Deploy hone ke baad apna final URL yahan daalna (SEO ke liye zaroori)
  url: 'https://sahiltech.in',
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
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sahil-chauhan-2107a9169/', handle: '@sahil-chauhan' },
  { label: 'GitHub', href: 'https://github.com/sahilchauhan482', handle: '@sahilchauhan482' },
  { label: 'Email', href: 'mailto:sahilchauhan482@gmail.com', handle: 'sahilchauhan482@gmail.com' },
  { label: 'Instagram', href: 'https://www.instagram.com/sahil_chauhan_1995/', handle: '@sahil_chauhan_1995' },
  { label: 'Facebook', href: 'https://www.facebook.com/sahil.rana.77770194/about', handle: '@sahil.rana.77770194' },
  { label: 'WhatsApp', href: 'https://wa.me/918708634845', handle: '+918708634845' },
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
//  PROJECTS — Automatically updated with real projects from D: drive
// =====================================================================
export const projects = [
  {
    title: 'Daksh Properties',
    description:
      'A premium real estate portal featuring high-performance property showcases, smooth scrolling layouts, and structured headless content management.',
    tech: ['Astro', 'Tailwind CSS v4', 'GSAP', 'Lenis', 'Sanity CMS'],
    image: '/daksh.png',
    live: 'https://dakshproperties.co.in/',
    github: '#',
    featured: true,
  },
  {
    title: 'SKUVelocity',
    description:
      'An enterprise purchase order management and tracking platform. Handles high-throughput imports, queues, background processing workers, and logistics control.',
    tech: ['.NET / C#', 'Web APIs', 'Repository Pattern', 'SQL Server', 'Unit Testing'],
    image: '',
    live: '#',
    github: '#',
    featured: true,
  },
  {
    title: 'Estyro Platform',
    description:
      'An enterprise business operations engine with a clean architecture C# backend, a React admin console dashboard, and a Flutter cross-platform mobile client.',
    tech: ['.NET', 'React', 'Flutter', 'SQL Server', 'JWT Authentication'],
    image: '/estyro.png',
    live: 'https://estyro.com/',
    github: '#',
    featured: true,
  },
  {
    title: 'Lakhdata Computer Care (LCC)',
    description:
      'A modern IT services and hardware repair portal featuring static page delivery, rich interactive animations, and a structured service booking system.',
    tech: ['Astro', 'React', 'GSAP', 'Lenis', 'Sanity CMS', 'TypeScript'],
    image: '/lakhdata.png',
    live: 'https://lakhdatacomputercare.com/',
    github: '#',
    featured: false,
  },
  {
    title: 'Voucher Management App',
    description:
      'A platform for generating, validating, and managing secure transaction vouchers, featuring ClosedXML data reports and a React dashboard.',
    tech: ['.NET', 'React', 'Vite', 'TypeScript', 'Axios', 'ClosedXML', 'SQL Server'],
    image: '',
    live: '#',
    github: '#',
    featured: false,
  },
  {
    title: 'Survey Management System',
    description:
      'A dynamic survey builder and responder portal. Supports complex forms, Redux State, webcam verification, and custom Express MongoDB APIs.',
    tech: ['React', 'Redux Toolkit', 'Material UI (MUI)', 'Node.js', 'Express', 'MongoDB'],
    image: '',
    live: '#',
    github: '#',
    featured: false,
  },
  {
    title: 'Reelyx Web Portal',
    description:
      'A next-generation media sharing and content streaming frontend, utilizing React 19, React Query for efficient data fetching, and Sentry for error tracking.',
    tech: ['React 19', 'TanStack Query', 'Vite', 'TypeScript', 'Sentry', 'React Router'],
    image: '',
    live: '#',
    github: '#',
    featured: false,
  },
  {
    title: 'This Interactive 3D Portfolio',
    description:
      'A premium 3D interactive portfolio featuring high-speed static page delivery, custom particle systems, collision detection, and performance tuning.',
    tech: ['Astro', 'React', 'React Three Fiber', 'Framer Motion', 'Tailwind'],
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
