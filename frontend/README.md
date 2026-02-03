# TODO Application Frontend

This is the frontend for the full-stack TODO application built with Next.js 16+, React 19, TypeScript, and Tailwind CSS.

## Features

- User authentication (sign up, sign in, logout)
- Task management (create, update, delete, mark as complete)
- Dashboard with task overview
- Calendar view for tasks
- Profile management
- Responsive design with dark/light mode

## Tech Stack

- Next.js 16+
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion (for animations)
- Lucide React (icons)
- Better Auth (authentication)

## Environment Variables

To run this project, you will need to set the following environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=https://amansaeed-hackathon-2-todo-full-stack-application.hf.space/api
```

## Deployment

This application is designed to be deployed on Vercel.

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" and import your repository
4. Set the environment variable:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://amansaeed-hackathon-2-todo-full-stack-application.hf.space/api`
5. Click "Deploy"

### Manual Deployment

If deploying manually:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Run the production server:
   ```bash
   npm run start
   ```

## API Integration

This frontend connects to the backend API deployed at:
`https://amansaeed-hackathon-2-todo-full-stack-application.hf.space/api`

The API provides endpoints for:
- Authentication (`/auth/login`, `/auth/register`, `/auth/token`)
- Task management (`/tasks/`, `/tasks/{id}`, `/tasks/{id}/complete`)

## Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── app/             # Next.js 16+ app router pages
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and API client
│   └── types/           # TypeScript type definitions
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request