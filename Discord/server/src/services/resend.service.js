import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)


const sendResendEmail = async (to, subject, html) => {
	try {
		const info = await resend.emails.send({
			from: 'ritikrajput.com',
			to,
			subject,
			html,
		});

		console.log('Message sent:', info.messageId);
	} catch (error) {
		console.error('Error sending email:', error.message);
		throw error;
	}
};


export default sendResendEmail