# Google OAuth + JWT Setup

This guide shows how to authenticate users with Google OAuth 2.0 in a Node.js backend and return a JWT after successful login.

## Prerequisites

- Node.js installed
- A Google account
- Basic knowledge of JavaScript and Node.js

## 1) Create Google OAuth Credentials

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Go to **APIs & Services > OAuth consent screen**.
4. Choose **External** and complete the required app details.
5. Go to **APIs & Services > Credentials**.
6. Click **Create Credentials > OAuth client ID**.
7. Choose **Web application**.
8. Add this authorized redirect URI:

```text
http://localhost:3000/auth/google/callback
```

9. Save the client and copy the **Client ID** and **Client Secret**.

## 2) Initialize the Project

If the project is not already initialized:

```bash
npm init -y
```

Install the required packages:

```bash
npm install express passport passport-google-oauth20 jsonwebtoken dotenv
```

## 3) Add Environment Variables

Create a `.env` file in the project root:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
```

## 4) Create the Express App

If you want a standalone entry file, create `app.js` and add the following code:

```js
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

const app = express();

app.use(passport.initialize());

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
		},
		(accessToken, refreshToken, profile, done) => {
			// In a real app, find or create the user in your database here.
			return done(null, profile);
		}
	)
);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
	'/auth/google/callback',
	passport.authenticate('google', { session: false }),
	(req, res) => {
		const token = jwt.sign(
			{ id: req.user.id, displayName: req.user.displayName },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		res.json({ token });
	}
);
```

## 5) Start the Server

If you are using `app.js` directly:

```bash
node app.js
```

If your project already uses `server.js`, import the same route logic there instead of creating a separate entry file.

## 6) Test the Flow

1. Open this URL in your browser:

```text
http://localhost:3000/auth/google
```

2. Sign in with your Google account.
3. After consent, Google redirects to the callback route.
4. The backend responds with a JWT token in JSON.

## Notes

- Replace the placeholder JWT secret with a long, random value.
- In production, store the JWT in an HTTP-only cookie or return it to a trusted client app.
- In a real application, store user records in a database instead of returning the Google profile directly.

## Troubleshooting

- **Redirect URI mismatch**: Make sure the redirect URI in Google Cloud Console matches your callback route.
- **Missing environment variables**: Verify `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `JWT_SECRET` are loaded.
- **Invalid callback URL**: If your app runs on a different port, update both the Google Console redirect URI and the `callbackURL` in Passport.

## Security Tips

- Never commit `.env` to version control.
- Use a strong `JWT_SECRET`.
- Validate and store user data before issuing tokens in production.
