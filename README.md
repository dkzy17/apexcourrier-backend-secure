 


### Translyfter  


A comprehensive delivery and logistics management system built with modern web technologies.

# Overview of the app

Translyfter is a full-stack delivery management platform that provides:

- **Customer Portal**: User-friendly interface for customers to book and track deliveries
- **Admin Dashboard**: Comprehensive management system for logistics operations
- **Real-time Tracking**: Live package tracking with GPS integration
- **Invoice Management**: Professional invoice and receipt generation

## Project Structure

```
oceanedgelogistics//
├── frontend/          # Customer-facing Next.js application
├── admin/            # Admin dashboard Next.js application
├── backend/          # Node.js/Express API server
└── README.md         # This file
```

## Tech Stack

### Frontend & Admin

- **Framework**: Next.js 14/15
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Icons**: React Icons

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Validation**: Express Validator

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   ```

4. **Install admin dashboard dependencies**

   ```bash
   cd admin
   npm install
   ```

5. **Set up environment variables**

   - Copy `.env.example` to `.env` in the backend directory
   - Update the database connection string and other configuration

6. **Start the development servers**

   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev

   # Terminal 3: Admin
   cd admin
   npm run dev
   ```

## API Documentation

The backend API is documented in `admin/API_DOCUMENTATION.md` with all endpoints available at `https://atlasorionlogistics.onrender.com/api`.

## Deployment

Each component can be deployed independently:

- **Frontend**: Deploy to Vercel or similar platform
- **Admin**: Deploy to Vercel or similar platform
- **Backend**: Deploy to Render, Heroku, or similar platform

## Contributing stuffs

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
# veno_atlas
