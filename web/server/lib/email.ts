import { Resend } from 'resend';

let resend: Resend | null = null;

const getResend = (): Resend | null => {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) return null;
    resend = new Resend(key);
  }
  return resend;
};

interface ContactNotification {
  name: string;
  email: string;
  message: string;
}

export const sendContactNotification = async (contact: ContactNotification): Promise<void> => {
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!to) {
    console.warn('[email] CONTACT_NOTIFICATION_EMAIL not set, skipping notification');
    return;
  }

  const client = getResend();
  if (!client) {
    console.warn('[email] RESEND_API_KEY not set, skipping notification');
    return;
  }

  await client.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'Portfolio <noreply@resend.dev>',
    to,
    replyTo: contact.email,
    subject: `New contact message from ${contact.name}`,
    text: [
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      '',
      'Message:',
      contact.message,
    ].join('\n'),
  });
};
