# Bill Management Application

A comprehensive bill management application built with React, TypeScript, and MySQL.

## Features

- **Bill Management**: Track water, electricity, household, credit card, phone, and internet bills
- **Payment Tracking**: Monitor monthly amounts, due dates, and payment methods
- **Dashboard**: Overview of all bills with payment progress and upcoming bills
- **Categories**: Organize bills by type with visual indicators
- **Payment Status**: Mark bills as paid/unpaid with automatic date tracking
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js
- **Database**: MySQL (AWS RDS)
- **Build Tool**: Vite
- **State Management**: React Hooks
- **UI Components**: Radix UI primitives with shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL database access
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   VITE_API_URL=http://localhost:3001/api
   DB_HOST=your-mysql-host
   DB_PORT=3306
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=bill_management
   ```

### Development

1. Start the full application (backend + frontend):
   ```bash
   npm run dev:full
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend server
   npm run dev:server
   
   # Terminal 2 - Frontend development server
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

### Database Schema

The application automatically creates the necessary database and tables on first run:

```sql
CREATE TABLE bills (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category ENUM('water', 'electricity', 'household', 'credit-card', 'phone', 'internet') NOT NULL,
  monthly_amount DECIMAL(10, 2) NOT NULL,
  due_date INT NOT NULL,
  payment_method ENUM('bank-transfer', 'credit-card', 'debit-card', 'cash', 'auto-pay') NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  last_paid_date DATETIME NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

- `GET /api/bills` - Get all bills
- `POST /api/bills` - Create a new bill
- `PUT /api/bills/:id` - Update a bill
- `DELETE /api/bills/:id` - Delete a bill
- `PATCH /api/bills/:id/paid` - Mark bill as paid/unpaid
- `GET /api/health` - Health check

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
├── server/
│   ├── database.js      # Database configuration and initialization
│   ├── routes/          # API routes
│   └── server.js        # Express server setup
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service layer
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── data/           # Static data and configurations
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.