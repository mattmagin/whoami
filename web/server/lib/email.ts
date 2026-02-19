import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

const getTransporter = (): Transporter | null => {
    if (!transporter) {
        const host = process.env.SMTP_HOST;
        const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (!host || !user || !pass) return null;

        transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });
    }
    return transporter;
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

    const transport = getTransporter();
    if (!transport) {
        console.warn('[email] SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS required), skipping notification');
        return;
    }

    await transport.sendMail({
        from: process.env.SMTP_FROM ?? 'Portfolio <noreply@example.com>',
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
