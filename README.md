# ChatGroq

ChatGroq is an AI-powered chat application built with Next.js, leveraging Supabase for backend functions and the Groq API for natural language processing.

## Features

- Real-time AI-powered chat interface
- Serverless backend using Supabase Edge Functions
- Responsive design for desktop and mobile use
- Integration with Groq's advanced language model

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later)
- A Supabase account
- A Groq API key

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/rksiitd1/ChatGroq.git
   cd ChatGroq
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Supabase:
   - Create a new project in Supabase
   - Install Supabase CLI: `npm install -g supabase`
   - Initialize Supabase in your project: `supabase init`
   - Link your project: `supabase link --project-ref YOUR_PROJECT_REF`

4. Deploy the Supabase function:
   ```
   supabase functions deploy chat --no-verify-jwt
   ```

5. Set your Groq API key as a secret in Supabase:
   ```
   supabase secrets set GROQ_API_KEY=your_actual_groq_api_key
   ```

6. Update the Supabase URL in `src/app/chat/page.js` with your project URL.

7. Create a `.env.local` file in the root directory and add your Supabase URL and anon key:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Running Locally

To run the project locally:

```
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Deployment

This project is configured for deployment on GitHub Pages. Push your changes to the main branch, and GitHub Actions will automatically deploy your updates.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.