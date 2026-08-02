/**
 * Generic Field Label Formatter
 * Converts raw form field keys into professional, human-readable labels
 */
export function formatFieldLabel(key: string): string {
  const map: Record<string, string> = {
    fullName: 'Full Name',
    name: 'Full Name',
    pilgrimName: 'Pilgrim Name',
    applicantName: 'Applicant Name',
    passengerName: 'Passenger Name',
    email: 'Email Address',
    emailAddress: 'Email Address',
    phone: 'Phone Number',
    phoneNumber: 'Phone Number',
    contactPhone: 'Contact Phone',
    packageType: 'Selected Package / Service',
    preferredPackageType: 'Preferred Package',
    packageName: 'Package Name',
    selectedPackage: 'Selected Package',
    departureDate: 'Departure Date',
    departureMonth: 'Departure Month / Date',
    startDate: 'Travel Start Date',
    travelDates: 'Travel Dates',
    adults: 'Number of Adults',
    travelersCount: 'Number of Travelers',
    numberOfPassengers: 'Number of Passengers',
    children: 'Children',
    infants: 'Infants',
    nationality: 'Nationality',
    destination: 'Destination',
    departureCity: 'Departure City',
    destinationCity: 'Destination City',
    website: 'Website',
    message: 'Message / Special Notes',
    specialNotes: 'Special Notes',
    consultationDetails: 'Consultation Details',
    enquiryNumber: 'Enquiry Reference #',
    bookingNumber: 'Booking Reference #',
    ticketNumber: 'Ticket Reference #',
    totalPrice: 'Estimated Total Price (CAD)',
    status: 'Submission Status',
  };

  if (map[key]) return map[key];

  // Fallback: convert camelCase or snake_case to Title Case
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

/**
 * Master 100% Mobile & Desktop Responsive HTML Email Template Generator
 * Pure Client-Safe HTML string generator
 */
export function getResponsiveEmailTemplateHtml(
  formName: string,
  data: Record<string, any>,
  isForUser: boolean = false
): string {
  const userName = data.fullName || data.name || data.pilgrimName || data.applicantName || 'Valued Customer';
  const enquiryRef = data.enquiryNumber || data.bookingNumber || data.ticketNumber || '';
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Filter out internal fields
  const filteredData = Object.entries(data).filter(
    ([k, v]) =>
      v !== undefined &&
      v !== null &&
      v !== '' &&
      !['id', 'createdAt', 'updatedAt', 'userId', 'password'].includes(k)
  );

  // Generate 2-Column Table Rows
  const tableRowsHtml = filteredData
    .map(([key, val], idx) => {
      const label = formatFieldLabel(key);
      const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      let displayVal = String(val);

      if (typeof val === 'boolean') {
        displayVal = val ? 'Yes' : 'No';
      }

      return `
        <tr style="background-color: ${bg}; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0f172a; width: 38%; vertical-align: top; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            ${label}
          </td>
          <td style="padding: 12px 16px; font-size: 13px; font-weight: 500; color: #334155; width: 62%; vertical-align: top; word-break: break-word; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            ${displayVal}
          </td>
        </tr>
      `;
    })
    .join('');

  const headerBadge = isForUser ? 'CONFIRMATION RECEIPT' : 'NEW INQUIRY NOTIFICATION';
  const headingTitle = isForUser
    ? `Thank You, ${userName}!`
    : `New Form Submission: ${formName}`;

  const subHeading = isForUser
    ? `We have received your submission via <strong>${formName}</strong>. Our dedicated travel team will review your inquiry and reach out to you within 24 hours.`
    : `A new inquiry has been submitted via <strong>${formName}</strong>. Submission details are listed below:`;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${formName} - King Travel Canada</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f1f5f9; }
    
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; margin: auto !important; border-radius: 0 !important; }
      .fluid-padding { padding: 20px 16px !important; }
      .header-title { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 30px 0;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #004B39 0%, #003326 100%); padding: 32px 24px; border-bottom: 4px solid #DB9E30;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: rgba(219, 158, 48, 0.15); border: 1px solid #DB9E30; color: #DB9E30; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                      ${headerBadge}
                    </div>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0; letter-spacing: -0.5px; font-family: Marcellus, Georgia, serif;">
                      King Travel Canada
                    </h1>
                    <p style="color: #a7f3d0; font-size: 12px; margin: 4px 0 0 0; font-weight: 600;">
                      Licensed Hajj &amp; Umrah Travel Operator
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="fluid-padding" style="padding: 32px 28px; background-color: #ffffff;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <tr>
                  <td style="padding-bottom: 12px;">
                    <h2 class="header-title" style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0; line-height: 1.3;">
                      ${headingTitle}
                    </h2>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 24px;">
                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">
                      ${subHeading}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px;">
                      <tr>
                        <td style="font-size: 12px; color: #64748b; font-weight: 600;">
                          📅 Date: <strong style="color: #0f172a;">${dateStr}</strong>
                        </td>
                        ${
                          enquiryRef
                            ? `<td align="right" style="font-size: 12px; color: #64748b; font-weight: 600;">
                                🔖 Ref: <strong style="color: #004B39; font-family: monospace;">${enquiryRef}</strong>
                              </td>`
                            : ''
                        }
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 12px;">
                    <h3 style="color: #004B39; font-size: 14px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                      📋 Submitted Form Details
                    </h3>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 28px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: separate; border-spacing: 0; border: 1px solid #cbd5e1; border-radius: 14px; overflow: hidden;">
                      ${tableRowsHtml}
                    </table>
                  </td>
                </tr>

                ${
                  isForUser
                    ? `
                    <tr>
                      <td style="padding-bottom: 24px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 14px; padding: 16px;">
                          <tr>
                            <td>
                              <h4 style="color: #065f46; font-size: 13px; font-weight: 800; margin: 0 0 4px 0;">
                                💬 What Happens Next?
                              </h4>
                              <p style="color: #047857; font-size: 12px; line-height: 1.5; margin: 0;">
                                Our expert pilgrimage advisors in Toronto are reviewing your request. If you have urgent questions, call us directly at <strong>+1 800-844-5464</strong>.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    `
                    : ''
                }

              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="background-color: #0f172a; padding: 28px 24px; border-top: 1px solid #1e293b; color: #94a3b8; font-size: 12px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <p style="color: #ffffff; font-weight: 800; font-size: 14px; margin: 0 0 4px 0;">
                      King Travel Canada Ltd.
                    </p>
                    <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.5;">
                      1325 Eglinton Ave E Ste 218, Mississauga, ON L4W 4L9, Canada<br>
                      TICO &amp; IATA Licensed Pilgrimage &amp; Flight Operator
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <a href="https://kingtravelcan.com" target="_blank" style="color: #DB9E30; text-decoration: none; font-weight: 700; font-size: 12px; margin: 0 8px;">
                      Visit Official Website →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="border-top: 1px solid #1e293b; padding-top: 16px; font-size: 11px; color: #475569;">
                    © 2026 King Travel Canada Ltd. All Rights Reserved. Automated system notification.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
