# Personal Finance Visualizer

Personal Finance Visualizer is a modern web application that helps you track, analyze, and visualize your personal finances. It provides interactive dashboards and charts to give you insights into your spending habits, budgets, and financial goals.

## Project Overview
This project is designed to make personal finance management simple and visually engaging. You can add your transactions, categorize your expenses, set monthly budgets, and instantly see how your spending compares to your goals. The dashboard provides a clear overview of your financial health with easy-to-understand charts and tables.

## Features
- **Dashboard Overview:** Get a quick summary of your total expenses, top spending categories, and recent transactions.
- **Budget vs Actual Comparison:** Visualize your planned budgets against your actual spending for each category with a side-by-side bar chart.
- **Category-wise Expense Pie Chart:** See a breakdown of your expenses by category in a colorful pie chart.
- **Monthly Expenses Bar Chart:** Track your spending trends over time with a monthly bar chart.
- **Transactions Management:** Add, edit, and delete transactions. Filter and search your transaction history.
- **Budgets Management:** Set and update monthly budgets for each category. Instantly see if you are over or under budget.
- **Categories Management:** Create, edit, and organize your expense categories, each with a custom color and icon.
- **Responsive UI:** Works seamlessly on desktop and mobile devices.

## Tech Stack
- **Next.js** (App Router)
- **TypeScript**
- **MongoDB**
- **Recharts** (data visualization)
- **Tailwind CSS**

## Getting Started
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your MongoDB connection string and other secrets.
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure
- `app/` - Next.js app directory (pages, layouts, API routes)
- `components/` - Reusable UI and chart components
- `lib/db/` - Database models and connection
- `styles/` - Global styles
- `public/` - Static assets

## Data
- Sample data files: `budgets.json`, `categories.json`, `expenses.json` (ignored by git)

## License
MIT
