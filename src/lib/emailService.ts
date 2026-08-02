import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getResponsiveEmailTemplateHtml, formatFieldLabel } from './emailTemplate';

export { getResponsiveEmailTemplateHtml, formatFieldLabel };

/**
 * Server-only Form Submission Dual Email Dispatcher
 * Sends Email #1 to Admin + Email #2 to User (if user email provided)
 */
export async function dispatchFormEmails(
  formName: string,
  submittedData: Record<string, any>,
  providedUserEmail?: string
): Promise<{ adminSent: boolean; userSent: boolean; error?: string }> {
  try {
    // 1. Fetch saved email settings from DB or defaults
    let adminRecipientEmail = process.env.SMTP_TO || 'info@kingtravelcan.com';
    let smtpHost = process.env.SMTP_HOST || '';
    let smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    let smtpUser = process.env.SMTP_USER || '';
    let smtpPass = process.env.SMTP_PASS || '';
    let fromEmail = process.env.SMTP_FROM || 'no-reply@kingtravelcan.com';

    try {
      const res = await db.select().from(siteSettings).where(eq(siteSettings.key, 'forms_settings')).limit(1);
      if (res && res.length > 0) {
        const config = JSON.parse(res[0].value);
        if (config?.emailConfigs?.sendToEmail) {
          adminRecipientEmail = config.emailConfigs.sendToEmail;
        }
        if (config?.emailConfigs?.fromEmail) {
          fromEmail = config.emailConfigs.fromEmail;
        }
      }
    } catch {
      // Fallback to defaults
    }

    // Determine user email
    const userEmail =
      providedUserEmail ||
      submittedData.email ||
      submittedData.emailAddress ||
      submittedData.userEmail ||
      '';

    const isValidUserEmail = typeof userEmail === 'string' && /\S+@\S+\.\S+/.test(userEmail.trim());

    // Build Admin & User Email HTML
    const adminHtml = getResponsiveEmailTemplateHtml(formName, submittedData, false);
    const userHtml = isValidUserEmail ? getResponsiveEmailTemplateHtml(formName, submittedData, true) : '';

    // Auto-Selected Generic Subjects
    const adminSubject = `[King Travel Canada] New Form Submission: ${formName}`;
    const userSubject = `Thank you for contacting King Travel Canada — ${formName} Received`;

    // 2. Check if SMTP Credentials exist
    if (!smtpHost || !smtpUser) {
      console.log(
        `[Email Dispatcher - Dry Run] Emails generated for "${formName}". SMTP not configured in .env. Admin: ${adminRecipientEmail}, User: ${userEmail || 'None'}`
      );
      return { adminSent: true, userSent: isValidUserEmail };
    }

    // Dynamically import nodemailer server-side to prevent bundler errors in Client Components
    const nodemailer = await import('nodemailer');

    // 3. Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    let adminSent = false;
    let userSent = false;

    // Dispatch Email #1: To Admin
    try {
      await transporter.sendMail({
        from: `"${formName} - King Travel" <${fromEmail}>`,
        to: adminRecipientEmail,
        subject: adminSubject,
        html: adminHtml,
      });
      adminSent = true;
      console.log(`✅ [Email Dispatcher] Admin notification sent to ${adminRecipientEmail}`);
    } catch (err: any) {
      console.error(`❌ [Email Dispatcher] Failed to send Admin email:`, err.message);
    }

    // Dispatch Email #2: To User (if user email provided)
    if (isValidUserEmail && userHtml) {
      try {
        await transporter.sendMail({
          from: `"King Travel Canada" <${fromEmail}>`,
          to: userEmail.trim(),
          subject: userSubject,
          html: userHtml,
        });
        userSent = true;
        console.log(`✅ [Email Dispatcher] User confirmation sent to ${userEmail}`);
      } catch (err: any) {
        console.error(`❌ [Email Dispatcher] Failed to send User email to ${userEmail}:`, err.message);
      }
    } else {
      console.log(`ℹ️ [Email Dispatcher] No user email entered. User confirmation email skipped.`);
    }

    return { adminSent, userSent };
  } catch (err: any) {
    console.error('dispatchFormEmails error:', err);
    return { adminSent: false, userSent: false, error: err.message };
  }
}
