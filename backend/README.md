# Translyfter Backend API

This is the backend API for the Translyfter package management system. It provides endpoints for managing packages, tracking events, and handling delivery status updates.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ocean-edge-logistics
NODE_ENV=development
```

3. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Packages

#### GET /api/packages

- Get all packages
- Returns an array of package objects

#### GET /api/packages/:id

- Get a single package by ID
- Returns a package object

#### POST /api/packages

- Create a new package
- Required fields in request body:
  - sender: { name, email, phone, address }
  - receiver: { name, email, phone, address }
  - weight: number
  - dimensions: { length, width, height }
  - serviceType: 'Standard' | 'Express' | 'International'
  - transportMode: 'Air' | 'Ground' | 'Sea'

#### PATCH /api/packages/:id

- Update a package
- Request body can contain any package fields to update

#### DELETE /api/packages/:id

- Delete a package

#### POST /api/packages/:id/events

- Add a tracking event to a package
- Required fields in request body:
  - status: string
  - location: string
  - notes: string (optional)

## Models

### Package

- trackingNumber: string (auto-generated)
- sender: object
  - name: string
  - email: string
  - phone: string
  - address: string
- receiver: object
  - name: string
  - email: string
  - phone: string
  - address: string
- weight: number
- dimensions: object
  - length: number
  - width: number
  - height: number
- serviceType: string
- transportMode: string
- status: string
- events: array
  - status: string
  - location: string
  - timestamp: date
  - notes: string
- createdAt: date
- updatedAt: date

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error

Error responses include a message field with details about the error.

## Development

The API is built with:

- Node.js
- Express
- MongoDB/Mongoose
- Express Validator for request validation
- CORS for cross-origin resource sharing
- Helmet for security headers
- Morgan for request logging
