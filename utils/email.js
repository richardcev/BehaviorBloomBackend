const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function generateElegantEmail(payload) {
  // --- PRE-PROCESAMIENTO DE DATOS ---
  
  // 1. Idiomas
  const languages = [];
  if (payload.english) languages.push('English');
  if (payload.spanish) languages.push('Spanish');
  if (payload.creole) languages.push('Creole');
  if (payload.other) languages.push(`Other: ${payload.otherLanguage}`);
  const languagesStr = languages.join(', ') || 'Not specified';

  // 2. Turnos de disponibilidad
  const shifts = [];
  if (payload.morning) shifts.push('Morning');
  if (payload.afternoon) shifts.push('Afternoon');
  const shiftsStr = shifts.join(', ') || 'Not specified';

  // 3. Edades preferidas
  const ages = [];
  if (payload.age2to7) ages.push('2–7 years');
  if (payload.age8to13) ages.push('8–13 years');
  if (payload.age14to18) ages.push('14–18 years');
  const agesStr = ages.join(', ') || 'Not specified';

  // 4. Documentación lista
  const docs = [];
  if (payload.driversLicense) docs.push("Driver's License");
  if (payload.socialSecurity) docs.push("Social Security Card");
  if (payload.workAuthorization) docs.push("Work Authorization");
  if (payload.medicaidLetter) docs.push("Medicaid Welcome Letter");
  
  if (payload.ein) {
    const einText = payload.einNumber ? `EIN (Number: ${payload.einNumber})` : "EIN";
    docs.push(einText);
  }

  const docsList = docs.length > 0 
    ? `<ul style="margin: 0; padding-left: 20px;">${docs.map(d => `<li>${d}</li>`).join('')}</ul>` 
    : 'None checked';

  // Helper para generar las etiquetas (badges) verde/rojo
  const getBadge = (value) => {
    const valStr = String(value || 'no').toLowerCase();
    const bgColor = valStr === 'yes' ? '#dcfce7' : '#fee2e2';
    const textColor = valStr === 'yes' ? '#166534' : '#991b1b';
    return `<span style="background-color: ${bgColor}; color: ${textColor}; padding: 4px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 12px;">${valStr}</span>`;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New RBT Application</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px 0; margin: 0;">
      
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        
        <tr>
          <td style="background-color: #0f172a; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Behavior Bloom LLC</h1>
            <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 14px;">Complete RBT Application</p>
          </td>
        </tr>

        <tr>
          <td style="padding: 40px 30px;">
            
            <h2 style="color: #0f172a; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; margin-top: 0;">Candidate Overview</h2>
            <table width="100%" style="font-size: 15px; color: #334155; line-height: 1.6;">
              <tr><td width="35%"><strong>Name:</strong></td><td>${payload.fullName}</td></tr>
              <tr><td><strong>Email:</strong></td><td><a href="mailto:${payload.email}" style="color: #2563eb;">${payload.email}</a></td></tr>
              <tr><td><strong>Phone:</strong></td><td>${payload.phoneNumber}</td></tr>
              <tr><td><strong>Location:</strong></td><td>${payload.city}, ${payload.zipCode}</td></tr>
              <tr><td><strong>Languages:</strong></td><td>${languagesStr}</td></tr>
            </table>

            <h2 style="color: #0f172a; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; margin-bottom: 20px;">Critical Requirements</h2>
            <table width="100%" style="font-size: 15px; color: #334155; line-height: 1.6;">
              <tr>
                <td width="40%"><strong>Active RBT:</strong></td>
                <td>${getBadge(payload.hasRBT)}</td>
              </tr>
              ${payload.hasRBT === 'yes' ? `<tr><td style="padding-bottom: 10px;"><strong>RBT Number:</strong></td><td style="padding-bottom: 10px;">${payload.rbtNumber}</td></tr>` : ''}
              
              <tr>
                <td><strong>Active Medicaid:</strong></td>
                <td>${getBadge(payload.hasMedicaid)}</td>
              </tr>
              ${payload.hasMedicaid === 'yes' ? `<tr><td style="padding-bottom: 10px;"><strong>Medicaid Exp:</strong></td><td style="padding-bottom: 10px;">${payload.medicaidExpiration}</td></tr>` : ''}
              
              <tr>
                <td><strong>Active NPI:</strong></td>
                <td>${getBadge(payload.hasNPI)}</td>
              </tr>
              ${payload.hasNPI === 'yes' ? `<tr><td><strong>NPI Number:</strong></td><td>${payload.npiNumber}</td></tr>` : ''}
            </table>

            <h2 style="color: #0f172a; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; margin-bottom: 20px;">Availability & Logistics</h2>
            <table width="100%" style="font-size: 15px; color: #334155; line-height: 1.6;">
              <tr><td width="40%"><strong>Start Immediately:</strong></td><td>${getBadge(payload.startImmediately)}</td></tr>
              ${payload.startImmediately === 'no' ? `<tr><td style="padding-bottom: 10px;"><strong>Reason:</strong></td><td style="padding-bottom: 10px; color: #b91c1c;">${payload.startExplanation}</td></tr>` : ''}
              <tr><td><strong>Available Shifts:</strong></td><td>${shiftsStr}</td></tr>
              <tr><td style="padding-bottom: 10px;"><strong>Exact Hours:</strong></td><td style="padding-bottom: 10px;">${payload.exactHours}</td></tr>
              <tr><td><strong>Reliable Transport:</strong></td><td>${getBadge(payload.reliableTransportation)}</td></tr>
              <tr><td><strong>Max Travel Distance:</strong></td><td>${payload.travelDistance}</td></tr>
            </table>

            <h2 style="color: #0f172a; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; margin-bottom: 20px;">Experience & Preferences</h2>
            <table width="100%" style="font-size: 15px; color: #334155; line-height: 1.6;">
              <tr><td width="40%"><strong>RBT Experience:</strong></td><td>${payload.yearsExperience} years</td></tr>
              <tr><td><strong>Preferred Locations:</strong></td><td>${payload.preferredLocations}</td></tr>
              <tr><td><strong>Preferred Ages:</strong></td><td>${agesStr}</td></tr>
            </table>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin-top: 15px; font-size: 14px; color: #475569;">
              <strong>Past Clinical Cases:</strong><br/>
              ${payload.pastCases}
            </div>

            <h2 style="color: #0f172a; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; margin-bottom: 20px;">Compliance & Documents</h2>
            <table width="100%" style="font-size: 15px; color: #334155; line-height: 1.6;">
              <tr><td width="65%"><strong>Can do notes within 24-48h:</strong></td><td>${getBadge(payload.notesTimeliness)}</td></tr>
              <tr><td><strong>Understands recoupment risks:</strong></td><td>${getBadge(payload.understandRecoupment)}</td></tr>
              <tr><td style="padding-bottom: 15px;"><strong>Medicaid/Insurance Experience:</strong></td><td style="padding-bottom: 15px;">${getBadge(payload.workedWithMedicaid)}</td></tr>
              <tr><td colspan="2"><strong>Documents Ready:</strong></td></tr>
              <tr><td colspan="2">${docsList}</td></tr>
            </table>

            <h2 style="color: #0f172a; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; margin-bottom: 20px;">Final Details</h2>
            <table width="100%" style="font-size: 15px; color: #334155; line-height: 1.6;">
              <tr><td width="40%"><strong>Ready to Onboard:</strong></td><td>${getBadge(payload.startOnboarding)}</td></tr>
              <tr><td><strong>Best Contact Time:</strong></td><td><strong>${payload.bestContactTime}</strong></td></tr>
            </table>

          </td>
        </tr>

        <tr>
          <td style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
            This email was generated automatically by the Recruitment Portal.<br/>
            Behavior Bloom LLC © ${new Date().getFullYear()}
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
}

const sendApplicationEmail = async (payload) => {
  const htmlBody = generateElegantEmail(payload);

  await transporter.sendMail({
    from: `"Behavior Bloom Alerts" <${process.env.SMTP_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `New Application: ${payload.fullName} - RBT Position`,
    text: `You have a new RBT application from ${payload.fullName}. Please open this email in an HTML-compatible client.`,
    html: htmlBody,
  });
};

module.exports = { sendApplicationEmail };