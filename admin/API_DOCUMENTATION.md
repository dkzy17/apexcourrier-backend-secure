# ApexCourrier Admin API Documentation

This document provides comprehensive API documentation for the ApexCourrier package management system admin interface.

## Base URL

```
https://atlasorionlogistics.onrender.com/api
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Content Type

All requests and responses use `application/json` content type.

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a `message` field with details about the error:

```json
{
  "message": "Error description"
}
```

For validation errors, the response includes an `errors` array:

```json
{
  "errors": [
    {
      "msg": "Sender name is required",
      "param": "sender.name",
      "location": "body"
    }
  ]
}
```

## API Endpoints

### Packages

#### GET /api/packages

Retrieve all packages in the system.

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "trackingNumber": "APX1703123456789123",
    "sender": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St, City, State 12345"
    },
    "receiver": {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+0987654321",
      "address": "456 Oak Ave, City, State 67890"
    },
    "weight": 2.5,
    "dimensions": {
      "length": 30,
      "width": 20,
      "height": 15
    },
    "serviceType": "Standard",
    "transportMode": "Ground",
    "status": "In Transit",
    "events": [
      {
        "status": "Package Received",
        "location": "Origin Facility",
        "timestamp": "2023-12-21T10:00:00.000Z",
        "notes": "Package received at origin facility"
      }
    ],
    "createdAt": "2023-12-21T09:00:00.000Z",
    "updatedAt": "2023-12-21T10:00:00.000Z"
  }
]
```

#### GET /api/packages/:id

Retrieve a specific package by its ID.

**Parameters:**

- `id` (string, required) - Package ID

**Response:**
Same structure as individual package object above.

**Error Responses:**

- `404` - Package not found

#### POST /api/packages

Create a new pkg.

**Request Body:**

```json
{
  "sender": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, State 12345"
  },
  "receiver": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+0987654321",
    "address": "456 Oak Ave, City, State 67890"
  },
  "weight": 2.5,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 15
  },
  "serviceType": "Standard",
  "transportMode": "Ground"
}
```

**Required Fields:**

- `sender.name` (string) - Sender's full name
- `sender.email` (string) - Valid email address
- `sender.phone` (string) - Phone number
- `sender.address` (string) - Full address
- `receiver.name` (string) - Receiver's full name
- `receiver.email` (string) - Valid email address
- `receiver.phone` (string) - Phone number
- `receiver.address` (string) - Full address
- `weight` (number) - Package weight (minimum 0.1)
- `dimensions.length` (number) - Length in cm (minimum 0.1)
- `dimensions.width` (number) - Width in cm (minimum 0.1)
- `dimensions.height` (number) - Height in cm (minimum 0.1)
- `serviceType` (string) - One of: `Standard`, `Express`, `International`
- `transportMode` (string) - One of: `Air`, `Ground`, `Sea`

**Response:**

- `201` - Package created successfully
- Returns the created package object with auto-generated `trackingNumber` and `_id`

**Error Responses:**

- `400` - Validation errors

#### PATCH /api/packages/:id

Update an existing pkg.

**Parameters:**

- `id` (string, required) - Package ID

**Request Body:**
Any subset of the package fields (except `_id` and `trackingNumber` which are immutable).

**Response:**

- `200` - Package updated successfully
- Returns the updated package object

**Error Responses:**

- `404` - Package not found
- `400` - Invalid data

#### DELETE /api/packages/:id

Delete a pkg.

**Parameters:**

- `id` (string, required) - Package ID

**Response:**

```json
{
  "message": "Package deleted"
}
```

**Error Responses:**

- `404` - Package not found

#### POST /api/packages/:id/events

Add a tracking event to a pkg.

**Parameters:**

- `id` (string, required) - Package ID

**Request Body:**

```json
{
  "status": "In Transit",
  "location": "Distribution Center",
  "notes": "Package sorted and loaded for delivery"
}
```

**Required Fields:**

- `status` (string) - Event status description
- `location` (string) - Location where event occurred

**Optional Fields:**

- `notes` (string) - Additional notes about the event

**Response:**

- `200` - Event added successfully
- Returns the updated package object with the new event
- The package's main `status` field is updated to match the new event's status

**Error Responses:**

- `404` - Package not found
- `400` - Validation errors

## Data Models

### Package Model

```javascript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  trackingNumber: String,           // Auto-generated unique tracking number (format: APX{timestamp}{random})
  sender: {
    name: String,                   // Required
    email: String,                  // Required, valid email
    phone: String,                  // Required
    address: String                 // Required
  },
  receiver: {
    name: String,                   // Required
    email: String,                  // Required, valid email
    phone: String,                  // Required
    address: String                 // Required
  },
  weight: Number,                   // Required, minimum 0.1
  dimensions: {
    length: Number,                 // Required, minimum 0.1
    width: Number,                  // Required, minimum 0.1
    height: Number                  // Required, minimum 0.1
  },
  serviceType: String,              // Required, enum: ['Standard', 'Express', 'International']
  transportMode: String,            // Required, enum: ['Air', 'Ground', 'Sea', 'Rail']
  status: String,                   // Default: 'Pending'
  events: [{
    status: String,                 // Required
    location: String,               // Required
    timestamp: Date,                // Auto-generated
    notes: String                   // Optional
  }],
  createdAt: Date,                  // Auto-generated
  updatedAt: Date                   // Auto-updated on save
}
```

## Admin API Service Usage

The admin interface uses the `ApiService` class located at `src/app/utils/api.js`. Here are the available methods:

```javascript
import ApiService from "./utils/api";

// Get all packages
const pkgs = await ApiService.getPackages();

// Get single package
const pkg = await ApiService.getPackage(packageId);

// Create new package
const newPackage = await ApiService.createPackage(packageData);

// Update package
const updatedPackage = await ApiService.updatePackage(packageId, updateData);

// Delete package
await ApiService.deletePackage(packageId);

// Add tracking event
const updatedPackage = await ApiService.addTrackingEvent(packageId, eventData);

// Find package by tracking number
const pkg = await ApiService.getPackageByTracking(trackingNumber);
```

## Environment Configuration

The API base URL is configured in the admin's API service:

```javascript
const API_BASE_URL = "https://atlasorionlogistics.onrender.com/api";
```

## Rate Limiting

Currently, there are no rate limiting restrictions on the API.

## CORS

The API supports Cross-Origin Resource Sharing (CORS) and accepts requests from any origin.

## Logging

The API uses Morgan for request logging in development mode.

## Database

The API uses MongoDB with Mongoose ODM. The database is hosted on MongoDB Atlas.

## Deployment

The backend API is deployed on Vercel and accessible at the base URL mentioned above.

---

_Last updated: December 2023_
