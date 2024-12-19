import { config } from "../config/app.config";
import { resend } from "./resendClient";

type Params = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  from?: string;
};

const mail_sender =
  config.NODE_ENV === "development"
    ? `no-reply <onboarding@resend.dev>`
    : `no-reply <${config.MAILER_SENDER}>`;

export const sendEmail = async function ({
  to,
  subject,
  text,
  html,
  from = mail_sender,
}: Params) {
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
  });

  return {
    error,
    data,
  };
};
