import { EmailDeliveryError, sendTransactionalEmail } from "@/lib/mail/resend";

export const CONTACT_EMAIL = "daviandrade.dev@gmail.com";

export function defaultContactMessage(language: "en" | "pt") {
  return language === "pt"
    ? "Olá Davi, vi o seu trabalho e gostaria de mais informações sobre seus projetos."
    : "Hi Davi, I came across your work and would like more information about your projects.";
}

export function defaultContactSubject(language: "en" | "pt") {
  return language === "pt" ? "Contato" : "Contact";
}

export function buildContactEmailBody(input: {
  name: string;
  replyEmail: string;
  message: string;
  language: "en" | "pt";
}) {
  const message = input.message.trim() || defaultContactMessage(input.language);
  const meta =
    input.language === "pt"
      ? [
          `Nome: ${input.name.trim() || "(não informado)"}`,
          `E-mail para resposta: ${input.replyEmail.trim()}`,
          "Enviado pela página de contato do daviandrade.dev Auth.",
        ]
      : [
          `Name: ${input.name.trim() || "(not provided)"}`,
          `Reply email: ${input.replyEmail.trim()}`,
          "Sent from the daviandrade.dev Auth contact page.",
        ];

  return [message, "", "—", ...meta].join("\n");
}

export async function deliverContactEmail(input: {
  subject: string;
  text: string;
  replyTo: string;
}) {
  try {
    await sendTransactionalEmail({
      to: CONTACT_EMAIL,
      subject: input.subject,
      text: input.text,
      replyTo: input.replyTo,
    });
  } catch (error) {
    throw error instanceof EmailDeliveryError ? new Error(error.code) : error;
  }
}
