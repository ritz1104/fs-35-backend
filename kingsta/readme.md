# Nodemailer with Gmail OAuth2 (Client ID + Client Secret)

This guide explains how to set up and use Nodemailer in a Node.js app with Gmail OAuth2 authentication using:

- Client ID
- Client Secret
- Refresh Token (generated from OAuth 2.0 Playground)

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## 1) Create OAuth2 Credentials in Google Cloud

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or choose an existing one).
3. Go to **APIs & Services > Library**.
4. Search for **Gmail API** and click **Enable**.
5. Go to **APIs & Services > Credentials**.
6. Click **Create Credentials > OAuth client ID**.
7. Choose **Web application**.
8. Add these **Authorized redirect URIs**:
	 - `http://localhost`
	 - `https://developers.google.com/oauthplayground`
9. Save and copy:
	 - `CLIENT_ID`
	 - `CLIENT_SECRET`

## 2) Generate a Refresh Token (OAuth 2.0 Playground)

1. Open [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
2. Click the settings icon (top-right).
3. Enable **Use your own OAuth credentials**.
4. Paste your `CLIENT_ID` and `CLIENT_SECRET`.
5. In Step 1, enter this scope:

```text
https://mail.google.com/
```

6. Click **Authorize APIs** and sign in with your Google account.
7. Click **Exchange authorization code for tokens**.
8. Copy the `refresh_token` from the Step 2 response.

## 3) Install Dependencies

If your project is not initialized yet:

```bash
npm init -y
```

Install required packages:

```bash
npm install nodemailer dotenv
```

## 4) Add Environment Variables

Create a `.env` file in your project root:

```env
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
REFRESH_TOKEN=your-refresh-token
EMAIL_USER=your-email@gmail.com
```

Replace all placeholder values with your real credentials.

## 5) Create Email Utility

Create `email.js`:

```js
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: process.env.EMAIL_USER,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken: process.env.REFRESH_TOKEN,
	},
});

// Optional connectivity check at startup
transporter.verify((error) => {
	if (error) {
		console.error('Email server connection failed:', error.message);
		return;
	}
	console.log('Email server is ready to send messages');
});

const sendEmail = async (to, subject, text, html) => {
	try {
		const info = await transporter.sendMail({
			from: `"Kingsta" <${process.env.EMAIL_USER}>`,
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

module.exports = sendEmail;
```

## 6) Use in App

In your app entry file (for example `src/app.js`), call the email function:

```js
const sendEmail = require('./email');

sendEmail(
	'recipient@example.com',
	'Test Email Subject',
	'This is a test email sent with Nodemailer using OAuth2.',
	'<p>This is a test email sent with <b>Nodemailer</b> using OAuth2.</p>'
);
```

## 7) Run

```bash
node src/app.js
```

If configured correctly, a message ID will be printed in the console and the email will be delivered.

## Troubleshooting

- **Invalid credentials**:
	- Verify `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`, and `EMAIL_USER`.
	- Ensure credentials belong to the same Google account you authorized.
- **Insufficient permissions**:
	- Confirm `https://mail.google.com/` scope was authorized.
- **Refresh token issues**:
	- Re-generate token from OAuth Playground after setting your own OAuth credentials.
- **Gmail account restrictions**:
	- Some Google Workspace policies may block SMTP/OAuth flows unless enabled by admin.

## Security Notes

- Never commit `.env` to Git.
- Rotate credentials immediately if leaked.
- Prefer environment secrets in deployment platforms (instead of hardcoding).

## References

- [Nodemailer Documentation](https://nodemailer.com/)
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Docs](https://developers.google.com/gmail/api)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
