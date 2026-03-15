# EzTro Web - Admin Dashboard

Web application for Staff and Admin management of the EzTro boarding house system.

## Project Structure

```
eztro-web/
├── public/              # Static assets
├── src/
│   ├── api/            # API service layer
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components
│   │   ├── common/     # Reusable components
│   │   └── layout/     # Layout components
│   ├── config/         # Configuration files
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── routes/         # Route definitions
│   ├── store/          # Redux store
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global CSS
├── .env                # Environment variables
├── .env.example        # Environment variables example
└── package.json        # Dependencies
```

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Redux Toolkit (for state management)
- Axios (for API calls)
- TailwindCSS or Material-UI (for styling)

## Getting Started

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=EzTro Web
```

## Features

- Staff Dashboard
- Admin Dashboard
- Report Management
- User Management
- House Management
- Room Management
- Invoice Management
- Ticket Management
- Real-time Notifications
