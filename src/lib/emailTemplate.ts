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
    originCity: 'Origin City',

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

  if (map[key]) {
    return map[key];
  }

  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}


/**
 * Escape dynamic values before inserting them into the email HTML.
 */
function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


/**
 * Format field values for email display.
 */
function formatFieldValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return escapeHtml(value.join(', '));
  }

  if (typeof value === 'object' && value !== null) {
    return escapeHtml(JSON.stringify(value));
  }

  return escapeHtml(value);
}


/**
 * Universal Master Email Template Generator
 *
 * Uses normal HTML email structure with all CSS inline.
 */
export function getResponsiveEmailTemplateHtml(
  formName: string,
  data: Record<string, any>,
  isForUser: boolean = false
): string {
  const safeFormName = escapeHtml(formName);

  const headingTitle = isForUser
    ? 'Thank You for Contacting King Travel Canada'
    : `New Form Submission: ${safeFormName}`;

  const descriptionHtml = isForUser
    ? `
      Thank you for contacting King Travel Canada.
      We have successfully received your inquiry via
      <strong>${safeFormName}</strong>.
      Your submission details are listed below:
    `
    : `
      A new inquiry has been submitted via
      <strong>${safeFormName}</strong>.
      Submission details are listed below:
    `;

  /**
   * Fields that should not appear inside email.
   */
  const excludedFields = [
    'id',
    '_id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'userId',
    'password',
    'passwordHash',
  ];

  const filteredData = Object.entries(data).filter(
    ([key, value]) =>
      value !== undefined &&
      value !== null &&
      value !== '' &&
      !excludedFields.includes(key)
  );

  /**
   * Generate dynamic form detail rows.
   */
  const tableRowsHtml = filteredData
    .map(([key, value], index) => {
      const label = escapeHtml(formatFieldLabel(key));
      const displayValue = formatFieldValue(value);

      const backgroundColor =
        index % 2 === 0 ? '#ffffff' : '#f8fafc';

      const borderBottom =
        index === filteredData.length - 1
          ? 'none'
          : '1px solid #e2e8f0';

      return `
        <tr style="background-color:${backgroundColor};">
          <td
            width="38%"
            valign="top"
            style="
              width:38%;
              padding:12px 16px;
              font-family:'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              font-size:13px;
              line-height:19px;
              font-weight:700;
              color:#0f172a;
              vertical-align:top;
              background-color:${backgroundColor};
              border-bottom:${borderBottom};
            "
          >
            ${label}
          </td>

          <td
            width="62%"
            valign="top"
            style="
              width:62%;
              padding:12px 16px;
              font-family:'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              font-size:13px;
              line-height:19px;
              font-weight:500;
              color:#334155;
              vertical-align:top;
              background-color:${backgroundColor};
              border-bottom:${borderBottom};
              word-break:break-word;
            "
          >
            ${displayValue}
          </td>
        </tr>
      `;
    })
    .join('\n');

  /**
   * Current submission date.
   */
  const submissionDate = new Intl.DateTimeFormat('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >
  <meta
    http-equiv="X-UA-Compatible"
    content="IE=edge"
  >
  <title>${headingTitle}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    width:100%;
    background-color:#f1f5f9;
    font-family:'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-text-size-adjust:100%;
    -ms-text-size-adjust:100%;
  "
>

  <!-- Email Background -->
  <table
    border="0"
    cellpadding="0"
    cellspacing="0"
    width="100%"
    role="presentation"
    style="
      width:100%;
      margin:0;
      padding:0;
      background-color:#f1f5f9;
      border-collapse:collapse;
      mso-table-lspace:0pt;
      mso-table-rspace:0pt;
    "
  >
    <tr>
      <td
        align="center"
        style="padding:30px 15px;"
      >

        <!-- Main Email Container -->
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          role="presentation"
          style="
            width:100%;
            max-width:600px;
            background-color:#ffffff;
            border:1px solid #e2e8f0;
            border-radius:20px;
            overflow:hidden;
            border-collapse:separate;
            mso-table-lspace:0pt;
            mso-table-rspace:0pt;
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              bgcolor="#004B39"
              style="
                padding:32px 24px;
                background-color:#004B39;
                border-bottom:4px solid #DB9E30;
                border-radius:20px 20px 0 0;
              "
            >

              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                role="presentation"
                style="
                  width:100%;
                  border-collapse:collapse;
                "
              >
                <tr>
                  <td
                    align="center"
                    style="padding-bottom:12px;"
                  >

                    <!-- Notification Badge -->
                    <table
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        margin:0 auto;
                        border-collapse:separate;
                      "
                    >
                      <tr>
                        <td
                          align="center"
                          bgcolor="#1f624f"
                          style="
                            padding:5px 12px;
                            background-color:#1f624f;
                            border:1px solid #DB9E30;
                            border-radius:50px;
                            color:#DB9E30;
                            font-size:10px;
                            line-height:14px;
                            font-weight:800;
                            text-transform:uppercase;
                            letter-spacing:1px;
                          "
                        >
                          ${
                            isForUser
                              ? 'INQUIRY RECEIVED'
                              : 'NEW INQUIRY NOTIFICATION'
                          }
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Company Name -->
                <tr>
                  <td align="center">
                    <h1
                      style="
                        margin:0;
                        padding:0;
                        color:#ffffff;
                        font-family:Marcellus, Georgia, 'Times New Roman', serif;
                        font-size:24px;
                        line-height:30px;
                        font-weight:900;
                        letter-spacing:-0.5px;
                      "
                    >
                      King Travel Canada
                    </h1>
                  </td>
                </tr>

                <!-- Subtitle -->
                <tr>
                  <td align="center">
                    <p
                      style="
                        margin:4px 0 0 0;
                        padding:0;
                        color:#a7f3d0;
                        font-size:12px;
                        line-height:18px;
                        font-weight:600;
                      "
                    >
                      Licensed Hajj &amp; Umrah Travel Operator
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>


          <!-- Main Content -->
          <tr>
            <td
              bgcolor="#ffffff"
              style="
                padding:32px 28px;
                background-color:#ffffff;
              "
            >

              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                role="presentation"
                style="
                  width:100%;
                  border-collapse:collapse;
                "
              >

                <!-- Heading -->
                <tr>
                  <td style="padding-bottom:12px;">
                    <h2
                      style="
                        margin:0;
                        padding:0;
                        color:#0f172a;
                        font-size:20px;
                        line-height:1.3;
                        font-weight:800;
                      "
                    >
                      ${headingTitle}
                    </h2>
                  </td>
                </tr>


                <!-- Description -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <p
                      style="
                        margin:0;
                        padding:0;
                        color:#475569;
                        font-size:14px;
                        line-height:1.6;
                      "
                    >
                      ${descriptionHtml}
                    </p>
                  </td>
                </tr>


                <!-- Submission Date -->
                <tr>
                  <td style="padding-bottom:24px;">

                    <table
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      width="100%"
                      role="presentation"
                      style="
                        width:100%;
                        background-color:#f8fafc;
                        border:1px solid #e2e8f0;
                        border-radius:12px;
                        border-collapse:separate;
                      "
                    >
                      <tr>
                        <td
                          style="
                            padding:12px 16px;
                            font-size:12px;
                            line-height:18px;
                            color:#64748b;
                            font-weight:600;
                          "
                        >
                          📅 Date:
                          <strong style="color:#0f172a;">
                            ${escapeHtml(submissionDate)}
                          </strong>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>


                <!-- Form Details Heading -->
                <tr>
                  <td style="padding-bottom:12px;">
                    <h3
                      style="
                        margin:0;
                        padding:0;
                        color:#004B39;
                        font-size:14px;
                        line-height:20px;
                        font-weight:800;
                        text-transform:uppercase;
                        letter-spacing:0.5px;
                      "
                    >
                      📋 Submitted Form Details
                    </h3>
                  </td>
                </tr>


                <!-- Form Details -->
                <tr>
                  <td style="padding-bottom:28px;">

                    <table
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      width="100%"
                      role="presentation"
                      style="
                        width:100%;
                        border:1px solid #cbd5e1;
                        border-radius:14px;
                        overflow:hidden;
                        border-collapse:separate;
                        border-spacing:0;
                      "
                    >
                      ${tableRowsHtml}
                    </table>

                  </td>
                </tr>

              </table>

            </td>
          </tr>


          <!-- Footer -->
          <tr>
            <td
              align="center"
              bgcolor="#0f172a"
              style="
                padding:28px 24px;
                background-color:#0f172a;
                border-top:1px solid #1e293b;
                border-radius:0 0 20px 20px;
                color:#94a3b8;
                font-size:12px;
              "
            >

              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                role="presentation"
                style="
                  width:100%;
                  border-collapse:collapse;
                "
              >

                <!-- Company Details -->
                <tr>
                  <td
                    align="center"
                    style="padding-bottom:12px;"
                  >
                    <p
                      style="
                        margin:0 0 4px 0;
                        color:#ffffff;
                        font-size:14px;
                        line-height:20px;
                        font-weight:800;
                      "
                    >
                      King Travel Canada Ltd.
                    </p>

                    <p
                      style="
                        margin:0;
                        color:#64748b;
                        font-size:11px;
                        line-height:1.5;
                      "
                    >
                      1325 Eglinton Ave E Ste 218,
                      Mississauga, ON L4W 4L9, Canada
                      <br>
                      TICO &amp; IATA Licensed Pilgrimage
                      &amp; Flight Operator
                    </p>
                  </td>
                </tr>


                <!-- Website -->
                <tr>
                  <td
                    align="center"
                    style="padding-bottom:16px;"
                  >
                    <a
                      href="https://kingtravelcan.com"
                      target="_blank"
                      style="
                        color:#DB9E30;
                        text-decoration:none;
                        font-size:12px;
                        font-weight:700;
                      "
                    >
                      Visit Official Website →
                    </a>
                  </td>
                </tr>


                <!-- Copyright -->
                <tr>
                  <td
                    align="center"
                    style="
                      padding-top:16px;
                      border-top:1px solid #1e293b;
                      color:#475569;
                      font-size:11px;
                      line-height:17px;
                    "
                  >
                    © ${new Date().getFullYear()}
                    King Travel Canada Ltd.
                    All Rights Reserved.
                    ${
                      isForUser
                        ? ''
                        : 'Automated system notification.'
                    }
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