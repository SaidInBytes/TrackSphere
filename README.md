# TrackSphere

A modern, full-stack reporting system built with React, TypeScript, and Node.js.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-teal?logo=tailwindcss)

## Features

- 📊 Dashboard with real-time stats (total, open, closed reports)
- 🥧 Pie chart breakdown by report status
- 📋 Filterable report table with date range support
- 📝 Create report form with validation
- 🔍 Report detail view
- 🌙 Dark mode UI
- 💾 localStorage persistence (offline-first)
- 🔌 REST API integration (Express backend)
- ✅ 67 unit tests with Vitest + React Testing Library
- 🚀 GitHub Actions CI on every push

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, TypeScript, Vite, TailwindCSS |
| Charts    | Recharts                                |
| Icons     | Lucide React                            |
| Routing   | React Router v7                         |
| Testing   | Vitest, React Testing Library           |
| Backend   | Node.js, Express, TypeScript            |
| Database  | PostgreSQL *(coming soon)*              |
| CI/CD     | GitHub Actions                          |

## Project Structure

```
TrackSphere/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── CreateReportForm.tsx
│   │   ├── ReportFilters.tsx
│   │   ├── ReportPieChart.tsx
│   │   ├── ReportTable.tsx
│   │   ├── StatusBadge.tsx
│   │   └── __tests__/
│   ├── data/             # Mock data
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx
│   │   └── ReportDetails.tsx
│   ├── services/         # API layer
│   │   └── reportApi.ts
│   ├── types/            # TypeScript interfaces
│   │   └── report.ts
│   └── utils/            # Helpers (localStorage)
│       └── reportStorage.ts
├── server/               # Express backend
│   └── src/
│       ├── controllers/
│       ├── routes/
│       └── types/
└── .github/
    └── workflows/
        └── ci.yml
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Backend

```bash
cd server
npm install
npm run dev
```

API runs on [http://localhost:3001/api](http://localhost:3001/api)

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3001/api
```

Create a `.env` file in `server/`:

```env
PORT=3001
```

## API Endpoints

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | `/api/reports`     | List all reports   |
| GET    | `/api/reports/:id` | Get single report  |
| POST   | `/api/reports`     | Create report      |
| PUT    | `/api/reports/:id` | Update report      |
| DELETE | `/api/reports/:id` | Delete report      |

## Testing

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## CI/CD

GitHub Actions runs on every push:
1. `npm ci` — install dependencies
2. `npm test` — run all 67 tests

## Scripts

| Command               | Description              |
|-----------------------|--------------------------|
| `npm run dev`         | Start frontend dev server |
| `npm run build`       | Production build          |
| `npm run preview`     | Preview production build  |
| `npm test`            | Run tests once            |
| `npm run test:watch`  | Run tests in watch mode   |
| `npm run test:coverage` | Generate coverage report |

## Roadmap

- [ ] PostgreSQL integration
- [ ] Edit / delete report UI
- [ ] Authentication
- [ ] Pagination
- [ ] Export reports to CSV

## License

MIT
