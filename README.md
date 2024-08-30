# Quizzy
**Quizzy** is a quiz app made using Next.js. This app allows users to create, manage, and take quizzes on various topics. It’s designed to be fast, responsive, and easy to use.

# Features

**User Authentication**: Secure login and registration with OAuth providers (e.g., Google). 
**Quiz Management**: Create, edit, and delete quizzes. 
**User Dashboard**: Personalized dashboard to manage quizzes and view quiz history. **Responsive Design**: Mobile-first design with full responsiveness across all devices. 
**Dark Mode**: Switch between light and dark themes. 
**Image Upload**: Upload and manage profile pictures. 
**Real-time Feedback**: Get instant results after completing a quiz.
**Search and Join By Code**: Search for available quizzes or join one using unique quiz codes.

## Prerequisites
Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/en/download/) (v14.x or later) 
- [MongoDB](https://www.mongodb.com/try/download/community) (or use a MongoDB cloud provider)

## Installation

1. **Clone the repository** :
```bash 
git clone https://github.com/jiaernlee/quizzy.git 
cd quizzy
```
2. **Install dependencies** : 
```bash
npm install
```
3. **Set up environment variables** :
Create a `.env.local` file in the root directory and add the necessary environment variables.
```env
NEXTAUTH_URL=http://localhost:3000 
NEXTAUTH_SECRET=your-secret-key 
AUTH_GOOGLE_ID=your-google-client-id 
NEXT_PUBLIC_BASE_URL=http://localhost:3000 
NODEMAILER_EMAIL=your-email@example.com 
NODEMAILER_PASSWORD=your-email-password 
AUTH_TRUST_HOST=http://localhost:3000
```
4. **Run the development server** :
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app in action.

## Google OAuth Setup
 To enable Google OAuth for this project, you'll need to create a new project in the [Google Cloud Console](https://console.cloud.google.com/). 
 
 Follow these steps: 
 1. **Create a new project**. 
 2. **Enable the Google+ API** (or "Google Identity API").
 3. **Create OAuth credentials**: Set up OAuth 2.0 Client IDs. 
 4. **Set the authorized redirect URI** to `http://localhost:3000/api/auth/callback/google` for development. 
 
 Once you've created your OAuth credentials, add the `Client ID` to the `AUTH_GOOGLE_ID` variable in your `.env.local` file. 
 
 For more detailed instructions, refer to the [official NextAuth.js documentation](https://next-auth.js.org/getting-started/introduction) or the [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2).

## Deployment

Quizzy is deployed on Netlify. To deploy your own version:

1.  **Connect your repository** to Netlify.
2.  **Set up environment variables** in Netlify’s settings.
3.  **Deploy the site** using the default build command `next build`.
