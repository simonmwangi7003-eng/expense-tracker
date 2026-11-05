# Pocketbook – React Expense Tracker

A responsive expense tracker built with React 18 + Vite. Data is stored in your browser (localStorage).

## Setup
Requires Node.js 18+ (https://nodejs.org).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
npm run preview    # serve the production build locally
```

## Features
- Add, edit, delete income and expenses with validation
- Filter by month, type, category; text search
- Balance / income / expense summary and optional monthly budget bar
- Spending-by-category breakdown and 6-month income vs. expense chart
- Currency selector, light / dark / auto theme, CSV export
- Fully responsive: mobile, tablet, desktop

## Structure
```
src/
  App.jsx                 state, filters, layout
  utils.js                helpers, categories, localStorage hook, CSV export
  styles.css              theme + responsive styles
  components/             Summary, Charts, TransactionForm, TransactionList, Settings
```
