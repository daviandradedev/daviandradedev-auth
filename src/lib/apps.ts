export type PortfolioApp = {
  id: string;
  nameKey: string;
  href: string;
  description: { en: string; pt: string };
  pair?: string;
};

export type ExternalLink = {
  id: string;
  nameKey: string;
  href: string;
  description: { en: string; pt: string };
};

export const ssoApps: PortfolioApp[] = [
  {
    id: "work-schedule",
    nameKey: "apps.workSchedule",
    href: process.env.NEXT_PUBLIC_APP_WORK_SCHEDULE_URL ?? "https://workschedule-dd.vercel.app/",
    description: {
      en: "On-site work schedule generator.",
      pt: "Gerador de escalas de trabalho presencial.",
    },
  },
  {
    id: "seriesaholic",
    nameKey: "apps.seriesaholic",
    href: process.env.NEXT_PUBLIC_APP_SERIESAHOLIC_URL ?? "http://localhost:3000",
    description: {
      en: "Track series, episodes, and watch progress.",
      pt: "Acompanhe séries, episódios e progresso de visualização.",
    },
  },
  {
    id: "asebili-student",
    nameKey: "apps.asebiliStudent",
    pair: "asebili",
    href: process.env.NEXT_PUBLIC_APP_ASEBILI_STUDENT_URL ?? "https://asebili-student.daviandrade.dev",
    description: {
      en: "Asebili LMS Student Portal.",
      pt: "Portal do Aluno Asebili LMS.",
    },
  },
  {
    id: "asebili-instructor",
    nameKey: "apps.asebiliInstructor",
    pair: "asebili",
    href: process.env.NEXT_PUBLIC_APP_ASEBILI_INSTRUCTOR_URL ?? "https://asebili-instructor.daviandrade.dev",
    description: {
      en: "Asebili LMS Instructor Portal.",
      pt: "Portal do Instrutor Asebili LMS.",
    },
  },
];

export const externalLinks: ExternalLink[] = [
  {
    id: "portfolio",
    nameKey: "apps.portfolio",
    href: process.env.NEXT_PUBLIC_APP_PORTFOLIO_URL ?? "https://daviandrade-portfolio.vercel.app/",
    description: {
      en: "Personal portfolio site.",
      pt: "Site do portfólio pessoal.",
    },
  },
];

export const portfolioApps = ssoApps;
