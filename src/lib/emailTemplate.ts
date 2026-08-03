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

  if (map[key]) return map[key];

  // Fallback: convert camelCase or snake_case to Title Case
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

/**
 * Universal Master Email Template Generator
 * Matches exact requested HTML template while dynamically injecting form fields
 */
export function getResponsiveEmailTemplateHtml(
  formName: string,
  data: Record<string, any>,
  isForUser: boolean = false
): string {
  const headingTitle = isForUser
    ? `Thank You for Contacting King Travel Canada`
    : `New Form Submission Received (${formName})`;

  // Filter out internal system fields
  const filteredData = Object.entries(data).filter(
    ([k, v]) =>
      v !== undefined &&
      v !== null &&
      v !== '' &&
      !['id', 'createdAt', 'updatedAt', 'userId', 'password'].includes(k)
  );

  // Generate dynamic <tr> table rows for submitted form fields
  const tableRowsHtml = filteredData
    .map(([key, val]) => {
      const label = formatFieldLabel(key);
      let displayVal = String(val);

      if (typeof val === 'boolean') {
        displayVal = val ? 'Yes' : 'No';
      }

      return `      <tr><td style="padding: 8px; font-weight: bold; width: 140px; color: #0f172a;">${label}:</td><td style="padding: 8px; color: #334155;">${displayVal}</td></tr>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Inquiry Notification</title></head>
<body style="font-family: sans-serif; background: #f8fafc; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
    <h2 style="color: #004B39; margin-top: 0;">King Travel Canada</h2>
    <h3 style="color: #0f172a;">${headingTitle}</h3>
    <table width="100%" style="border-collapse: collapse; font-size: 13px;">
${tableRowsHtml}
    </table>
    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
    <p style="font-size: 11px; color: #94a3b8; text-align: center;">© 2026 King Travel Canada Ltd. All Rights Reserved.</p>
  </div>
</body>
</html>`;
}
