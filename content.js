/**
 * content.js — Edit this file to update your site content.
 * Populated from Susmit-Kallurkar-Resume.pdf on 2026-05-04.
 *
 * Rules:
 * - Dates in "MMM YYYY" format (e.g., "Dec 2025") or "Present"
 * - Plain text for descriptions; no HTML tags
 * - Tech arrays render as pill badges
 */

const CONTENT = {
  // ---------------------------------------------------------------
  // HERO
  // ---------------------------------------------------------------
  hero: {
    greeting: "Hello, I'm",
    name: "Susmit Kallurkar",
    title: "Cloud Support Engineer II at AWS",
    subtitle: "AWS SME · EC2 Linux · ElastiCache · 6+ years at Amazon · Dublin, Ireland",
    terminalLine: "$ whoami && cat about.md",
    cta: {
      primary: { label: "Get in Touch", href: "#contact" },
      secondary: { label: "View Experience", href: "#experience" },
      tertiary: { label: "Download CV ↓", href: "Susmit-Kallurkar-Resume.pdf" }
    }
  },

  // ---------------------------------------------------------------
  // ABOUT (shown in the hero terminal)
  // ---------------------------------------------------------------
  about: [
    "AWS Cloud Support Engineer with 6+ years at Amazon, designing, operating,",
    "and optimizing mission-critical cloud infrastructure for enterprise customers.",
    "Dual AWS SME — EC2 Linux (2024) and ElastiCache (2026).",
    "",
    "I spend my days on the escalations where standard runbooks have run out —",
    "complex EC2 Linux investigations, ElastiCache reliability work, and the",
    "deep cross-service problems that span compute, storage, and network.",
    "",
    "Reliability-first by default. Automation and observability for the rest."
  ],

  // ---------------------------------------------------------------
  // EXPERIENCE (most recent first)
  // ---------------------------------------------------------------
  experience: [
    {
      company: "AWS",
      role: "Cloud Support Engineer II (CSE-2), Linux Domain",
      period: "Dec 2025 – Present",
      location: "Dublin, Ireland",
      logo: "AWS",
      points: [
        "Appointed AWS SME for EC2 Linux and ElastiCache; partner with enterprise stakeholders to align AWS solutions with business objectives",
        "Drive adoption of automated remediation pipelines (AWS Systems Manager Automation) and chaos engineering workflows (Gremlin), reducing MTTR by 35% for critical workloads",
        "Designed Prometheus/Grafana dashboards for real-time SLO/SLI tracking (CPU, memory, latency); sub-second alerting for 95% of services",
        "Integrated CloudWatch Alarms with automated runbooks, cutting incident resolution time by 40% and directly supporting 99.99% uptime SLAs",
        "Architected multi-region, auto-scaling EC2 and ElastiCache clusters with Terraform-based IaC — reduced infrastructure costs by 25% via auto-scaling policies and right-sizing",
        "Trained 20+ engineers on SRE best practices (blameless post-mortems, error budgeting), reducing incident recurrence by 30%; authored 20+ Knowledge Center articles",
        "95% CSAT across enterprise accounts; recognized as Top Performer in Q1 2026"
      ]
    },
    {
      company: "AWS",
      role: "Cloud Support Engineer I (CSE-1), Linux Domain",
      period: "Apr 2023 – Dec 2025",
      location: "Dublin, Ireland",
      logo: "AWS",
      points: [
        "Earned AWS SME in EC2 Linux recognition for expertise in troubleshooting complex Linux environments",
        "Partnered with TAMs and stakeholders to reduce escalation time by 50% through deep-dive performance analysis (perf, tcpdump) and Bash/Python automation",
        "Developed CI/CD pipelines (CodePipeline/CodeBuild) to automate EC2 health checks, log analysis, and security patching — cut manual effort by 45%",
        "Pioneered blameless post-mortems and error budgeting for 3 major accounts, reducing incident recurrence by 35%",
        "Implemented auto-scaling groups and spot instance strategies for EC2 and ElastiCache, saving customers $1.2M/year",
        "Advised 8+ customers on AWS migration (EC2, RDS, S3, ElastiCache) with auto-scaling and load balancing for resilient architectures",
        "Mentored 10+ junior engineers to SME certification; 98% CSAT; promoted to CSE-2 for outstanding performance",
        "Reduced MTTR by 30% through proactive health checks and automated runbooks"
      ]
    },
    {
      company: "AWS",
      role: "Cloud Support Associate, Linux",
      period: "Oct 2021 – Apr 2023",
      location: "Dublin, Ireland",
      logo: "AWS",
      points: [
        "Resolved EC2, S3, VPC networking, and ElastiCache issues for Linux-based workloads",
        "Reduced repeat escalations by 40% through documentation playbooks and root-cause analysis",
        "Built Bash and Python scripts to automate routine tasks (log parsing, health checks), improving team efficiency by 25%",
        "Partnered with engineering to file 15+ feature requests, enhancing AWS service reliability and customer experience",
        "Advised customers on AWS migration best practices, aligning solutions with business objectives"
      ]
    },
    {
      company: "Amazon",
      role: "Customer Service Associate",
      period: "Apr 2020 – Oct 2021",
      location: "Dublin, Ireland",
      logo: "Amazon",
      points: [
        "Frontline customer support across multiple Amazon channels, handling high-volume queries",
        "Developed strong problem-solving and communication skills in a fast-paced environment",
        "Consistently exceeded performance targets, leading to selection for AWS Support graduate programme",
        "Built foundational understanding of Amazon systems and operational processes"
      ]
    }
  ],

  // ---------------------------------------------------------------
  // SKILLS (grouped for the grid)
  // ---------------------------------------------------------------
  skills: {
    cloud: [
      { name: "AWS", icon: "☁️" },
      { name: "EC2", icon: "🖥️" },
      { name: "ElastiCache", icon: "⚡" },
      { name: "S3", icon: "🪣" },
      { name: "EBS", icon: "💾" },
      { name: "VPC", icon: "🌐" },
      { name: "IAM", icon: "🔐" },
      { name: "CloudWatch", icon: "📊" },
      { name: "Systems Manager", icon: "🛠️" },
      { name: "Migration Services", icon: "🚚" }
    ],
    infrastructure_as_code: [
      { name: "Terraform", icon: "🏗️" },
      { name: "CloudFormation", icon: "📜" },
      { name: "Ansible", icon: "⚙️" }
    ],
    containers_and_orchestration: [
      { name: "Kubernetes", icon: "☸️" },
      { name: "Docker", icon: "🐳" }
    ],
    observability: [
      { name: "Prometheus", icon: "🔥" },
      { name: "Grafana", icon: "📈" },
      { name: "CloudWatch", icon: "📊" },
      { name: "Datadog", icon: "🐕" },
      { name: "Chaos Engineering (Gremlin)", icon: "👹" },
      { name: "SLO / SLI design", icon: "🎯" }
    ],
    os_and_scripting: [
      { name: "Linux", icon: "🐧" },
      { name: "Bash", icon: "💻" },
      { name: "Python", icon: "🐍" },
      { name: "Go", icon: "🐹" }
    ],
    networking: [
      { name: "TCP/IP", icon: "🌐" },
      { name: "DNS", icon: "🌐" },
      { name: "VPN", icon: "🔒" },
      { name: "Load Balancing", icon: "⚖️" },
      { name: "Route 53", icon: "🛤️" }
    ]
  },

  // ---------------------------------------------------------------
  // CERTIFICATIONS
  // ---------------------------------------------------------------
  certifications: [
    {
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "AWS",
      date: "2025",
      expires: "",
      link: "https://www.credly.com/users/susmit-kallurkar",
      badge: "🏅"
    },
    {
      title: "AWS Certified Cloud Practitioner",
      issuer: "AWS",
      date: "2020",
      expires: "",
      link: "https://www.credly.com/users/susmit-kallurkar",
      badge: "🏅"
    },
    {
      title: "AWS SME – ElastiCache",
      issuer: "AWS Internal",
      date: "2026",
      expires: "",
      link: "",
      badge: "⚡"
    },
    {
      title: "AWS SME – EC2 Linux",
      issuer: "AWS Internal",
      date: "2024",
      expires: "",
      link: "",
      badge: "🐧"
    },
    {
      title: "Terraform Associate",
      issuer: "HashiCorp",
      date: "2024",
      expires: "",
      link: "https://www.credly.com/users/susmit-kallurkar",
      badge: "🏗️"
    },
    {
      title: "Chaos Engineering Principles",
      issuer: "",
      date: "2024",
      expires: "",
      link: "",
      badge: "👹"
    },
    {
      title: "Linux Bootcamp — Advanced System Administration",
      issuer: "",
      date: "2020",
      expires: "",
      link: "",
      badge: "🐧"
    }
  ],

  // ---------------------------------------------------------------
  // PROJECTS
  // Generic, public-safe descriptions of real personal work.
  // Replace or extend as you open-source projects.
  // ---------------------------------------------------------------
  projects: [
    {
      id: "01",
      icon: "🤖",
      title: "AWS Support Investigation Agent",
      description: "A personal Kiro CLI agent wired up for AWS support investigations. Integrates internal knowledge bases, an Obsidian vault of past learnings, and custom tooling to accelerate the 'where do I even look first' phase of complex EC2 escalations. Generates Command Center links, investigation playbooks, and drafts customer-facing responses that follow my personal style guide.",
      tech: ["Kiro CLI", "Bash", "Obsidian", "Markdown", "MCP"],
      link: ""
    },
    {
      id: "02",
      icon: "🗂️",
      title: "Case Knowledge Vault",
      description: "Obsidian-based knowledge vault that indexes years of EC2 Linux and ElastiCache investigation patterns, tagged by service, failure class, and reusable diagnostic approach. Every case I work on feeds a learnings note so the next investigation of a similar class starts from a position of knowledge, not a blank page.",
      tech: ["Obsidian", "Markdown", "Dataview"],
      link: ""
    },
    {
      id: "03",
      icon: "🛠️",
      title: "Investigation Playbook",
      description: "Battle-tested playbook for EC2 Linux escalations — real techniques from case work, not theory. CloudWatch metric-math templates, structured response templates, EBS performance analysis, and investigation checklists for the first 15 minutes of any new case.",
      tech: ["Markdown", "CloudWatch", "Metric Math", "Bash"],
      link: ""
    },
    {
      id: "04",
      icon: "📊",
      title: "Observability Dashboards",
      description: "Prometheus and Grafana dashboards built for real-time SLO / SLI tracking across enterprise AWS workloads. CPU, memory, latency panels with sub-second alerting on 95% of critical services. Integrated with CloudWatch Alarms and automated runbooks to cut incident resolution time by 40%.",
      tech: ["Prometheus", "Grafana", "CloudWatch", "Terraform"],
      link: ""
    }
    // Add more here as you publish public repos. Template:
    // { id: "05", icon: "🎯", title: "...", description: "...", tech: [...], link: "https://github.com/ksusmit/repo" }
  ],

  // ---------------------------------------------------------------
  // PUBLICATIONS / CONTRIBUTIONS
  // ---------------------------------------------------------------
  publications: [
    {
      icon: "📄",
      title: "Technical Writing",
      items: [
        "Authored 20+ AWS Knowledge Center articles on EC2 reliability, ElastiCache optimization, and SRE frameworks",
        "Internal re:Post contributions on Linux troubleshooting patterns and operational best practices"
      ]
    },
    {
      icon: "🎓",
      title: "Training & Mentoring",
      items: [
        "Trained 20+ engineers and customers on SRE best practices — blameless post-mortems, error budgeting, and automated remediation",
        "Mentored 10+ junior engineers to SME certification across EC2 Linux and networking domains",
        "Delivered technical deep-dives on performance analysis (perf, tcpdump) and automation with Bash/Python"
      ]
    },
    {
      icon: "🛠️",
      title: "Automation & Tooling",
      items: [
        "Developed CI/CD pipelines (CodePipeline / CodeBuild) for EC2 health checks, log analysis, and security patching",
        "Implemented auto-scaling and spot instance strategies saving customers $1.2M/year across 8+ enterprise accounts",
        "Pioneered chaos engineering workflows (Gremlin) across critical customer workloads"
      ]
    }
  ],

  // ---------------------------------------------------------------
  // EDUCATION
  // ---------------------------------------------------------------
  education: [
    {
      icon: "🎓",
      degree: "MBA, Cloud Computing",
      institution: "Dublin Business School, Ireland",
      grade: "Dissertation: Barriers & Benefits of Cloud Adoption in Manufacturing SMEs",
      period: "Sep 2018 – Oct 2019"
    }
  ],

  // ---------------------------------------------------------------
  // CONTACT
  // ---------------------------------------------------------------
  contact: {
    intro: "Got a question, want to collaborate, or just want to chat about EC2 weirdness? I read every message.",
    links: [
      {
        icon: "✉️",
        label: "Email",
        value: "kallurkar.susmit@gmail.com",
        href: "mailto:kallurkar.susmit@gmail.com"
      },
      {
        icon: "💼",
        label: "LinkedIn",
        value: "susmit-kallurkar",
        href: "https://linkedin.com/in/susmit-kallurkar"
      },
      {
        icon: "🐙",
        label: "GitHub",
        value: "ksusmit-commits",
        href: "https://github.com/ksusmit-commits"
      }
    ]
  },

  // ---------------------------------------------------------------
  // FOOTER
  // ---------------------------------------------------------------
  footer: {
    copyright: "© 2026 Susmit Kallurkar",
    tagline: "Built between escalations, powered by ☕ and curiosity. 🥚 secrets: 0/8 found"
  },

  // ---------------------------------------------------------------
  // DEBUG / "UNDER THE HOOD" PANEL
  // ---------------------------------------------------------------
  debug: {
    builtWith: ["HTML5", "CSS3", "Vanilla JS", "IntersectionObserver", "GitHub Pages"],
    accessibility:
      "Semantic HTML, ARIA labels, keyboard navigable, responsive 320px–4K, prefers-reduced-motion respected.",
    note: "No frameworks. No dependencies. Just HTML, CSS, and JS."
  }
};
