import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { env } from './env';

type CreateTransportFn = (options: SMTPTransport.Options) => Transporter<SentMessageInfo>;

const createMailTransport: CreateTransportFn = nodemailer.createTransport;

const buildTransport = (): Transporter<SentMessageInfo> => {
  if (env.mailHost) {
    return createMailTransport({
      host: env.mailHost,
      port: env.mailPort,
      secure: env.mailPort === 465,
      auth: {
        user: env.mailUser,
        pass: env.mailPass
      }
    });
  }

  return createMailTransport({
    service: env.mailService,
    auth: {
      user: env.mailUser,
      pass: env.mailPass
    }
  });
};

export const mailer: Transporter<SentMessageInfo> = buildTransport();


