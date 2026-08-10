import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user:process.env.GOOGLE_USER,
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        refreshToken:process.env.GOOGLE_REFRESH_TOKEN
    }
})

transporter.verify((error) => {
	if (error) {
		console.error('Email server connection failed:', error.message);
		return;
	}
	console.log('Email server is ready to send messages');
});

export const sendEmail = async (to, subject, text, html) => {
	try {
		const info = await transporter.sendMail({
			from: `"Kingsta" <${process.env.GOOGLE_USER}>`,
			to,
			subject,
			text,
			html,
		});

		console.log('Message sent:', info.messageId);
	} catch (error) {
		console.error('Error sending email:', error.message);
		throw error;
	}
};

