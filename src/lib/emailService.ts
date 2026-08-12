import { db } from '@/db';
import { siteSettings, emailDeliveryLogs } from '@/db/schema';
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
    let adminRecipientEmail = process.env.SMTP_TO || 'saudivisa@kingtravelcan.com';
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
    const adminSubject = `[King Travel Canada] ${formName}`;
    const userSubject = `Thank you for Contacting King Travel Canada — ${formName} Received`;

    // 2. Check if SMTP Credentials exist
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error(
        `[Email Dispatcher] SMTP is not configured.`
      );

      return {
        adminSent: false,
        userSent: false,
        error: 'SMTP is not configured.',
      };
    }

    // Dynamically import nodemailer server-side to prevent bundler errors in Client Components
    const nodemailer = await import('nodemailer');

    // 3. Setup Nodemailer Transporter with Connection Pooling & Fast Timeouts (Forced IPv4)
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      family: 4,
      pool: true,
      maxConnections: 3,
      connectionTimeout: 8000,
      greetingTimeout: 6000,
      socketTimeout: 10000,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    } as any);

    // Prepare Email #1 (Admin)
    const adminPromise = transporter.sendMail({
      from: `"${formName} - King Travel" <${fromEmail}>`,
      to: adminRecipientEmail,
      subject: adminSubject,
      html: adminHtml,
    });

    // Prepare Email #2 (User, if email is valid)
    const userPromise = (isValidUserEmail && userHtml)
      ? transporter.sendMail({
        from: `"King Travel Canada" <${fromEmail}>`,
        to: userEmail.trim(),
        subject: userSubject,
        html: userHtml,
      })
      : Promise.resolve(null);

    // Dispatch both emails in parallel simultaneously
    const [adminResult, userResult] = await Promise.allSettled([adminPromise, userPromise]);

    let adminSent = false;
    let userSent = false;

    if (adminResult.status === 'fulfilled') {
      adminSent = true;
      console.log(`✅ [Email Dispatcher] Admin notification sent to ${adminRecipientEmail}`);
      try {
        await db.insert(emailDeliveryLogs).values({
          formId: formName,
          status: 'Delivered',
          sentTo: adminRecipientEmail,
          details: 'Notification sent successfully via SMTP',
        });
      } catch (logErr) { console.error('Failed to log admin email success', logErr); }
    } else {
      console.error(`❌ [Email Dispatcher] Failed to send Admin email:`, adminResult.reason?.message || adminResult.reason);
      try {
        await db.insert(emailDeliveryLogs).values({
          formId: formName,
          status: 'Failed',
          sentTo: adminRecipientEmail,
          details: adminResult.reason?.message || 'SMTP Error',
        });
      } catch (logErr) { console.error('Failed to log admin email error', logErr); }
    }

    if (userResult.status === 'fulfilled' && userResult.value !== null) {
      userSent = true;
      console.log(`✅ [Email Dispatcher] User confirmation sent to ${userEmail}`);
      try {
        await db.insert(emailDeliveryLogs).values({
          formId: formName,
          status: 'Delivered',
          sentTo: userEmail.trim(),
          details: 'User confirmation sent successfully via SMTP',
        });
      } catch (logErr) { console.error('Failed to log user email success', logErr); }
    } else if (userResult.status === 'rejected') {
      console.error(`❌ [Email Dispatcher] Failed to send User email to ${userEmail}:`, userResult.reason?.message || userResult.reason);
      try {
        await db.insert(emailDeliveryLogs).values({
          formId: formName,
          status: 'Failed',
          sentTo: userEmail.trim(),
          details: userResult.reason?.message || 'SMTP Error',
        });
      } catch (logErr) { console.error('Failed to log user email error', logErr); }
    } else {
      console.log(`ℹ️ [Email Dispatcher] No user email entered. User confirmation email skipped.`);
    }

    return { adminSent, userSent };
  } catch (err: any) {
    console.error('dispatchFormEmails error:', err);
    return { adminSent: false, userSent: false, error: err.message };
  }
}
