import { Resend } from 'resend';
import { config } from './config.ts';

const resend = new Resend(config.RESEND_API_KEY);

export async function sendMail(
  to: string[],
  subject: string,
  html: string,
): Promise<void> {
  try {
    // Resend API কল
    const { data, error } = await resend.emails.send({
      from: 'FileSharing <onboarding@resend.dev>',
      to: to,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error(' Email sending failed:', error);
      return;
    }

    console.log(' Email sent successfully:', data?.id);
  } catch (error) {
    console.error(' Email service error:', error);
  }
}
