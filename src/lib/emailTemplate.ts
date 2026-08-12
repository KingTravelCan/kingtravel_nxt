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

  // Fallback: convert camelCase, snake_case or kebab-case to Title Case
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}


/**
 * Escapes HTML characters from dynamic user/form values.
 * Important for email safety and preventing broken HTML.
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
 * Formats submitted field values for display.
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
 * Universal King Travel Canada Email Template
 *
 * Email-safe implementation:
 * - Table-based layout
 * - Inline CSS only
 * - No <html>
 * - No <head>
 * - No <body>
 * - No <style>
 * - No <div>
 * - No heading tags
 * - No paragraph tags
 *
 * Designed for Gmail, Outlook, Apple Mail, etc.
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
    ? `Thank you for contacting King Travel Canada. We have successfully received your submission via <span style="font-weight:bold; color:#334155;">${safeFormName}</span>. Our team will review your inquiry and contact you shortly.`
    : `A new inquiry has been submitted via <span style="font-weight:bold; color:#334155;">${safeFormName}</span>. Submission details are listed below:`;

  /**
   * Remove fields that should never be displayed in an email.
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
   * Build alternating table rows dynamically.
   */
  const tableRowsHtml = filteredData
    .map(([key, value], index) => {
      const label = escapeHtml(formatFieldLabel(key));
      const displayValue = formatFieldValue(value);

      const backgroundColor =
        index % 2 === 0 ? '#ffffff' : '#f8fafc';

      const isLastRow = index === filteredData.length - 1;

      const borderBottom = isLastRow
        ? 'none'
        : '1px solid #e2e8f0';

      return `
        <tr>
          <td
            width="38%"
            valign="top"
            bgcolor="${backgroundColor}"
            style="
              width:38%;
              padding:12px 16px;
              border-bottom:${borderBottom};
              background-color:${backgroundColor};
              color:#0f172a;
              font-family:Arial, Helvetica, sans-serif;
              font-size:13px;
              line-height:19px;
              font-weight:bold;
            "
          >
            ${label}
          </td>

          <td
            width="62%"
            valign="top"
            bgcolor="${backgroundColor}"
            style="
              width:62%;
              padding:12px 16px;
              border-bottom:${borderBottom};
              background-color:${backgroundColor};
              color:#334155;
              font-family:Arial, Helvetica, sans-serif;
              font-size:13px;
              line-height:19px;
              font-weight:500;
              word-break:break-word;
              overflow-wrap:anywhere;
            "
          >
            ${displayValue}
          </td>
        </tr>`;
    })
    .join('');

  /**
   * Format current date for email notification.
   */
  const submissionDate = new Intl.DateTimeFormat('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return `
<table
  width="100%"
  border="0"
  cellpadding="0"
  cellspacing="0"
  role="presentation"
  style="
    width:100%;
    margin:0;
    padding:0;
    background-color:#f1f5f9;
    font-family:Arial, Helvetica, sans-serif;
  "
>
  <tr>
    <td
      align="center"
      style="padding:30px 15px;"
    >

      <!-- Main Email Container -->
      <table
        width="600"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="
          width:100%;
          max-width:600px;
          background-color:#ffffff;
          border:1px solid #e2e8f0;
          border-radius:20px;
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
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="width:100%;"
            >

              <!-- Notification Badge -->
              <tr>
                <td
                  align="center"
                  style="padding:0 0 12px 0;"
                >

                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="margin:0 auto;"
                  >
                    <tr>
                      <td
                        align="center"
                        bgcolor="#1f624f"
                        style="
                          padding:5px 12px;
                          background-color:#1f624f;
                          border:1px solid #DB9E30;
                          border-radius:20px;
                          color:#DB9E30;
                          font-family:Arial, Helvetica, sans-serif;
                          font-size:10px;
                          line-height:14px;
                          font-weight:bold;
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
                <td
                  align="center"
                  style="
                    padding:0;
                    color:#ffffff;
                    font-family:Georgia, 'Times New Roman', serif;
                    font-size:24px;
                    line-height:30px;
                    font-weight:bold;
                  "
                >
                  King Travel Canada
                </td>
              </tr>

              <!-- Company Subtitle -->
              <tr>
                <td
                  align="center"
                  style="
                    padding:4px 0 0 0;
                    color:#a7f3d0;
                    font-family:Arial, Helvetica, sans-serif;
                    font-size:12px;
                    line-height:18px;
                    font-weight:600;
                  "
                >
                  Licensed Hajj &amp; Umrah Travel Operator
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
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="width:100%;"
            >

              <!-- Heading -->
              <tr>
                <td
                  style="
                    padding:0 0 12px 0;
                    color:#0f172a;
                    font-family:Arial, Helvetica, sans-serif;
                    font-size:20px;
                    line-height:27px;
                    font-weight:bold;
                  "
                >
                  ${headingTitle}
                </td>
              </tr>


              <!-- Description -->
              <tr>
                <td
                  style="
                    padding:0 0 24px 0;
                    color:#475569;
                    font-family:Arial, Helvetica, sans-serif;
                    font-size:14px;
                    line-height:23px;
                  "
                >
                  ${descriptionHtml}
                </td>
              </tr>


              <!-- Submission Date -->
              <tr>
                <td
                  style="padding:0 0 24px 0;"
                >

                  <table
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="
                      width:100%;
                      background-color:#f8fafc;
                      border:1px solid #e2e8f0;
                      border-radius:12px;
                    "
                  >
                    <tr>
                      <td
                        style="
                          padding:12px 16px;
                          color:#64748b;
                          font-family:Arial, Helvetica, sans-serif;
                          font-size:12px;
                          line-height:18px;
                          font-weight:600;
                        "
                      >
                        Date:
                        <span
                          style="
                            color:#0f172a;
                            font-weight:bold;
                          "
                        >
                          ${escapeHtml(submissionDate)}
                        </span>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>


              <!-- Form Details Heading -->
              <tr>
                <td
                  style="
                    padding:0 0 12px 0;
                    color:#004B39;
                    font-family:Arial, Helvetica, sans-serif;
                    font-size:14px;
                    line-height:20px;
                    font-weight:bold;
                    text-transform:uppercase;
                    letter-spacing:0.5px;
                  "
                >
                  Submitted Form Details
                </td>
              </tr>


              <!-- Dynamic Form Fields -->
              <tr>
                <td
                  style="padding:0 0 28px 0;"
                >

                  <table
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="
                      width:100%;
                      border:1px solid #cbd5e1;
                      border-collapse:collapse;
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
            "
          >

            <table
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="width:100%;"
            >

              <!-- Company -->
              <tr>
                <td
                  align="center"
                  style="
                    padding:0 0 4px 0;
                    color:#ffffff;
                    font-family:Arial, Helvetica, sans-serif;
                    font-size:14px;
                    line-height:20px;
                    font-weight:bold;
                  "
                >
                  King Travel Canada Ltd.
                </td>
              </tr>


              <!-- Address -->
              <tr>
                <td
                  align="center"
                  style="
                    padding:0 0 16px 0;
                    color:#64748b;
                    font-family:Arial, Helvetica, sans-serif;
                    font-size:11px;
                    line-height:17px;
                  "
                >
                  1325 Eglinton Ave E Ste 218,
                  Mississauga, ON L4W 4L9, Canada
                  <br>
                  TICO &amp; IATA Licensed Pilgrimage &amp; Flight Operator
                </td>
              </tr>


              <!-- Website -->
              <tr>
                <td
                  align="center"
                  style="
                    padding:0 0 16px 0;
                    color:#DB9E30;
                    font-family:Arial, Helvetica, sans-serif;
                    font-size:12px;
                    line-height:18px;
                    font-weight:bold;
                  "
                >
                  <a
                    href="https://kingtravelcan.com"
                    target="_blank"
                    style="
                      color:#DB9E30;
                      text-decoration:none;
                      font-family:Arial, Helvetica, sans-serif;
                      font-size:12px;
                      font-weight:bold;
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
                    padding:16px 0 0 0;
                    border-top:1px solid #1e293b;
                    color:#475569;
                    font-family:Arial, Helvetica, sans-serif;
                    font-size:11px;
                    line-height:17px;
                  "
                >
                  © ${new Date().getFullYear()} King Travel Canada Ltd.
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
`.trim();
}