const { sendEmail } = require('../config/email');

// Email templates
const emailTemplates = {
    adminApproval: (name, restaurantName, loginUrl) => `
    <h2>Welcome to Restaurant Dashboard!</h2>
    <p>Dear ${name},</p>
    <p>Your admin account for <strong>${restaurantName}</strong> has been approved.</p>
    <p>You can now access your restaurant dashboard using the link below:</p>
    <a href="${loginUrl}" style="display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">
      Access Dashboard
    </a>
    <p>If you have any questions, feel free to contact our support team.</p>
    <p>Best regards,<br>Restaurant Dashboard Team</p>
  `,

    adminRejection: (name, restaurantName, reason) => `
    <h2>Account Registration Update</h2>
    <p>Dear ${name},</p>
    <p>We regret to inform you that your admin account request for <strong>${restaurantName}</strong> has been rejected.</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    <p>If you believe this is a mistake, please contact our support team for further assistance.</p>
    <p>Best regards,<br>Restaurant Dashboard Team</p>
  `,

    passwordReset: (name, resetUrl) => `
    <h2>Password Reset Request</h2>
    <p>Dear ${name},</p>
    <p>You requested to reset your password. Click the button below to proceed:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">
      Reset Password
    </a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <p>Best regards,<br>Restaurant Dashboard Team</p>
  `,
};

// Send email using template
const sendTemplateEmail = async (to, templateName, variables) => {
    let subject, html;

    switch (templateName) {
        case 'adminApproval':
            subject = 'Your Admin Account Has Been Approved';
            html = emailTemplates.adminApproval(
                variables.name,
                variables.restaurantName,
                variables.loginUrl
            );
            break;

        case 'adminRejection':
            subject = 'Admin Account Request Update';
            html = emailTemplates.adminRejection(
                variables.name,
                variables.restaurantName,
                variables.reason
            );
            break;

        case 'passwordReset':
            subject = 'Password Reset Request';
            html = emailTemplates.passwordReset(variables.name, variables.resetUrl);
            break;

        default:
            throw new Error('Invalid email template');
    }

    return await sendEmail(to, subject, html);
};

module.exports = { sendTemplateEmail };