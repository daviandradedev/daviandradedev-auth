export type PortfolioApp = {
  id: string;
  nameKey: string;
  href: string;
  description: { en: string; pt: string };
};

export const portfolioApps: PortfolioApp[] = [
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
      en: "TV series tracker with TV Time import.",
      pt: "Tracker de séries com importação do TV Time.",
    },
  },
  {
    id: "portfolio",
    nameKey: "apps.portfolio",
    href: process.env.NEXT_PUBLIC_APP_PORTFOLIO_URL ?? "https://daviandrade.dev",
    description: {
      en: "Personal portfolio site.",
      pt: "Site do portfólio pessoal.",
    },
  },
];
