import { Hono } from 'hono';
import { db, schema } from '../db';
import { sendContactNotification } from '../lib/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const app = new Hono()
  .post('/', async (c) => {
    const body = await c.req.json();
    const contact = body.contact ?? body;

    const { name, email, message } = contact;

    // Validation
    const errors: string[] = [];
    if (!name || typeof name !== 'string' || name.trim().length === 0) errors.push("Name can't be blank");
    if (!email || typeof email !== 'string' || email.trim().length === 0) errors.push("Email can't be blank");
    else if (!EMAIL_REGEX.test(email)) errors.push('Email is invalid');
    if (!message || typeof message !== 'string' || message.trim().length === 0) errors.push("Message can't be blank");

    if (errors.length > 0) {
      return c.json({ error: 'invalid_content', message: errors.join(', ') }, 422);
    }

    // Insert into database
    await db.insert(schema.contacts).values({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    // Send email notification (fire and forget)
    sendContactNotification({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    }).catch((err) => {
      console.error('[contacts] Failed to send notification email:', err);
    });

    return c.json({ message: 'Message sent successfully' }, 201);
  });

export default app;
