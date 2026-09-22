export type PortfolioApp = {
  id: string;
  nameKey: string;
  href: string;
  description: { en: string; pt: string };
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
