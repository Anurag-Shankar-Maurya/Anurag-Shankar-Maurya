import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Logo, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Anurag",
  lastName: "Shankar Maurya",
  name: `Anurag Shankar Maurya`,
  role: "Android & Full-Stack Developer — AI & Software Developer",
  avatar: "/images/avatar.jpg", // Assuming a default avatar image
  email: "anuragshankarmaurya@gmail.com",
  location: "Asia/Calcutta", // Based on current time zone
  languages: ["English", "Hindi"], // Assuming Hindi as a primary language
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/Anurag-Shankar-Maurya",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/anurag-shankar-maurya",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as an ${person.role}`,
  headline: <>Innovative Android & Full-Stack Developer with expertise in Kotlin, Python, Django, and AI-driven applications.</>,
  featured: {
    display: false, // Hiding featured work for now, as no specific project is highlighted
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Anurag Shankar Maurya</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work", // Link to general work page
  },
  subline: (
    <>
      I'm Anurag, an Android & Full-Stack Developer passionate about building scalable, efficient, and user-centric software solutions.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Summary",
    description: (
      <>
        Innovative Android & Full-Stack Developer with expertise in Kotlin, Python, Django, and AI-driven
        applications. Experienced in Retrieval-Augmented Generation (RAG), real-time transcription, compliance AI,
        and UI/UX design. Passionate about building scalable, efficient, and user-centric software solutions.
      </>
    ),
  },
  work: {
    display: true,
    title: "Experience",
    experiences: [
      {
        company: "TechOTD Solutions Pvt. Ltd.",
        timeframe: "March 2025 – Present",
        role: "Software Developer Intern",
        achievements: [
          <>Developed AI-powered compliance tools for GDPR/CCPA adherence, building RAG systems with MongoDB & Pinecone and implementing LangChain for context-aware chatbots.</>,
          <>Created real-time speech transcription with speaker diarization using Django, Deepgram & WebSocket, plus designed responsive frontend interfaces.</>,
        ],
        images: [],
      },
      {
        company: "Institute of Engineering & Technology, Lucknow",
        timeframe: "2024",
        role: "Android Application Development Intern",
        achievements: [
          <>Developed AI-enhanced Android apps using Gemini API for personalized interactions.</>,
          <>Optimized UI/UX for performance and accessibility.</>,
        ],
        images: [],
      },
      {
        company: "Sanchar Mitra, DOT (Govt. of India)",
        timeframe: "2023",
        role: "Public Outreach Intern",
        achievements: [
          <>Conducted workshops on cybersecurity & digital tools, impacting 500+ participants.</>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "Central University of Haryana, Mahendragarh",
        description: <>B.Tech. in Computer Science & Engineering ◦ GPA: 8+/10 — Relevant Coursework: AI, DBMS, Web Development, Algorithms (2021–2025)</>,
      },
      {
        name: "Parvati Prema Jagati Saraswati Vihar, Nainital",
        description: <>Senior Secondary School (XII), CBSE ◦ Percentage: 93.4% (2020)</>,
      },
      {
        name: "Parvati Prema Jagati Saraswati Vihar, Nainital",
        description: <>Secondary School (X), CBSE ◦ Percentage: 93.2% (2018)</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Key Skills",
    skills: [
      {
        title: "Mobile Development",
        description: <>Kotlin, Java, Android SDK, Firebase, Room DB, REST APIs(Basic)</>,
        tags: [{ name: "Kotlin" }, { name: "Java" }, { name: "Android SDK" }],
        images: [],
      },
      {
        title: "AI & ML",
        description: <>Python, LangChain, OpenAI, Pinecone, Deepgram, Gemini API, RAG Systems</>,
        tags: [{ name: "Python" }, { name: "LangChain" }, { name: "OpenAI" }],
        images: [],
      },
      {
        title: "Web Development",
        description: <>Django(Intermediate), React.js(Intermediate), HTML/CSS, JavaScript, WebSocket</>,
        tags: [{ name: "Django" }, { name: "React.js" }, { name: "HTML/CSS" }],
        images: [],
      },
      {
        title: "Databases",
        description: <>MongoDB, SQLite, Vector Search</>,
        tags: [{ name: "MongoDB" }, { name: "SQLite" }],
        images: [],
      },
      {
        title: "UI/UX Design",
        description: <>Figma, Canva, Adobe Photoshop, Material Design, Responsive Web</>,
        tags: [{ name: "Figma" }, { name: "Canva" }],
        images: [],
      },
      {
        title: "DevOps & Tools",
        description: <>Git, GitHub, Linux/Unix</>,
        tags: [{ name: "Git" }, { name: "GitHub" }, { name: "Linux/Unix" }],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  projects: [
    {
      title: "DeepTranscribe– Real-Time Speech Transcription & AI Chatbot",
      description: "(Django, Deepgram, WebSocket) ◦ Built a speaker diarization system with real-time transcription and AI-powered Q&A. ◦ Integrated LangChain & Pinecone for contextual memory in chatbot responses.",
      href: "https://github.com/Anurag-Shankar-Maurya/DeepTranscribe", // Assuming this is the correct link
      image: {
        src: "/images/projects/project-01/cover-01.jpg", // Placeholder image
        alt: "DeepTranscribe Project",
        width: 16,
        height: 9,
      },
      tags: [{ name: "Django" }, { name: "Deepgram" }, { name: "WebSocket" }],
    },
    {
      title: "Censor AI– Email Compliance & Risk Mitigation Tool",
      description: "(Python, Django, OpenAI, REST APIs) ◦ Developed an AI-driven email validator for policy compliance (GDPR/CCPA). ◦ Implemented automated manager approval workflows for high-risk emails.",
      href: "https://github.com/Anurag-Shankar-Maurya/Censor-AI", // Assuming this is the correct link
      image: {
        src: "/images/projects/project-01/cover-02.jpg", // Placeholder image
        alt: "Censor AI Project",
        width: 16,
        height: 9,
      },
      tags: [{ name: "Python" }, { name: "Django" }, { name: "OpenAI" }],
    },
    {
      title: "Sparkle AI– Personalized Chat Android App",
      description: "(Kotlin, Gemini API, Firebase) ◦ Integrated Google’s Gemini API for dynamic AI personalities and chat interactions.",
      href: "https://github.com/Anurag-Shankar-Maurya/Sparkle-AI", // Assuming this is the correct link
      image: {
        src: "/images/projects/project-01/cover-03.jpg", // Placeholder image
        alt: "Sparkle AI Project",
        width: 16,
        height: 9,
      },
      tags: [{ name: "Kotlin" }, { name: "Gemini API" }, { name: "Firebase" }],
    },
    {
      title: "FakeHai– Fake News Detection Android App",
      description: "(Kotlin, Gemini API, Fine-Tuned AI Model) ◦ Designed an AI model to detect fake news with real-time analysis and visual indicators.",
      href: "https://github.com/Anurag-Shankar-Maurya/FakeHai", // Assuming this is the correct link
      image: {
        src: "/images/projects/project-01/cover-04.jpg", // Placeholder image
        alt: "FakeHai Project",
        width: 16,
        height: 9,
      },
      tags: [{ name: "Kotlin" }, { name: "Gemini API" }, { name: "AI Model" }],
    },
    {
      title: "We Parcel– Courier Service Landing Page",
      description: "(HTML, CSS, JavaScript) ◦ Created a responsive UI with real-time tracking and booking system.",
      href: "https://github.com/Anurag-Shankar-Maurya/We-Parcel", // Assuming this is the correct link
      image: {
        src: "/images/projects/project-01/image-01.jpg", // Placeholder image
        alt: "We Parcel Project",
        width: 16,
        height: 9,
      },
      tags: [{ name: "HTML" }, { name: "CSS" }, { name: "JavaScript" }],
    },
  ],
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
