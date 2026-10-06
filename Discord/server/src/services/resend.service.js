import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

const sendBrevoEmail = async (to, subject, html)=>{
    const result = await brevo.transactionalEmails.sendTransacEmail({
  subject,
  htmlContent: html,
  sender: { name: 'Discord', email: 'ritikrajput2611@gmail.com' },
  to: [{ email: to }],
})
console.log('Email sent. Message ID:', result.messageId);
}


export default sendBrevoEmail