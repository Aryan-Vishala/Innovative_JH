# Innovative Jharkhand — API Documentation (v1)

Base URL: `http://localhost:5000/api/v1`

---

## 1. Authentication (`/api/v1/auth`)

### 1.1 Register User
- **Method**: `POST`
- **Path**: `/api/v1/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Rahul Kumar",
  "email": "citizen@gumla.in",
  "mobile": "9876543210",
  "password": "password123",
  "primaryRole": "citizen",
  "district": "Gumla",
  "block": "Kamdara",
  "panchayat": "Kamdara North"
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "Rahul Kumar",
      "email": "citizen@gumla.in",
      "primaryRole": "citizen",
      "location": { "district": "Gumla", "block": "Kamdara" }
    },
    "token": "eyJhbGciOiJIUz..."
  }
}
```

### 1.2 Login
- **Method**: `POST`
- **Path**: `/api/v1/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "citizen@gumla.in",
  "password": "password123"
}
```

### 1.3 Get Current User Profile
- **Method**: `GET`
- **Path**: `/api/v1/auth/me`
- **Header**: `Authorization: Bearer <token>`
- **Response**: Current user object with organization details.

---

## 2. Problems Engine (`/api/v1/problems`)

### 2.1 Submit Problem (4-Step Wizard)
- **Method**: `POST`
- **Path**: `/api/v1/problems`
- **Header**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `title`: string
  - `description`: string
  - `category`: string (`Water Management`, `Agriculture`, `Healthcare`, `Education`, etc.)
  - `district`: string
  - `block`: string
  - `panchayat`: string
  - `village`: string
  - `latitude`: number (optional)
  - `longitude`: number (optional)
  - `estimatedPopulation`: number
  - `frequency`: string (`Daily`, `Weekly`, `Seasonal`)
  - `citizenReportedSeverity`: string (`Low`, `Medium`, `High`, `Critical`)
  - `evidenceFiles`: file attachments (images, PDFs, videos)

### 2.2 Get All Problems
- **Method**: `GET`
- **Path**: `/api/v1/problems?district=Gumla&category=Water+Management&status=SUBMITTED&search=fluoride`
- **Access**: Public

### 2.3 Get My Submissions
- **Method**: `GET`
- **Path**: `/api/v1/problems/my-submissions`
- **Header**: `Authorization: Bearer <token>`

### 2.4 Get Problem by ID
- **Method**: `GET`
- **Path**: `/api/v1/problems/:id` (Accepts Mongo `_id` or `JH-000001`)

---

## 3. PRI / ULB Ground Verification (`/api/v1/pri`)

### 3.1 Get PRI Queue
- **Method**: `GET`
- **Path**: `/api/v1/pri/queue`
- **Header**: `Authorization: Bearer <token>` (Role: `pri` or `admin`)

### 3.2 Get PRI Stats
- **Method**: `GET`
- **Path**: `/api/v1/pri/stats`
- **Header**: `Authorization: Bearer <token>` (Role: `pri` or `admin`)

### 3.3 Validate Problem
- **Method**: `PATCH`
- **Path**: `/api/v1/problems/:id/pri-validate`
- **Header**: `Authorization: Bearer <token>` (Role: `pri` or `admin`)
- **Request Body**:
```json
{
  "isGenuine": true,
  "observedPopulation": 350,
  "groundCondition": "Water from handpumps causes yellow teeth and severe joint stiffness in villagers.",
  "baselineData": {
    "fluoride_ppm": 2.4,
    "water_supply_hrs": 1.5
  },
  "remarks": "Priority issue. Verified physically."
}
```

---

## 4. Nodal HEI Review & Orchestration (`/api/v1/nodal`)

### 4.1 Get Verified Problems
- **Method**: `GET`
- **Path**: `/api/v1/nodal/problems?domain=Water+Management`
- **Header**: `Authorization: Bearer <token>` (Role: `nodal` or `admin`)

### 4.2 Get Nodal Domain Stats
- **Method**: `GET`
- **Path**: `/api/v1/nodal/stats`
- **Header**: `Authorization: Bearer <token>` (Role: `nodal` or `admin`)

### 4.3 Nodal Problem Review / Master Problem Creation
- **Method**: `PATCH`
- **Path**: `/api/v1/problems/:id/nodal-review`
- **Header**: `Authorization: Bearer <token>` (Role: `nodal` or `admin`)
- **Request Body**:
```json
{
  "action": "CONVERTED_TO_MASTER",
  "confirmedDomain": "Water Management",
  "confirmedSeverity": "High",
  "masterProblemTitle": "Smart Community Fluoride Filtration & Real-Time Monitoring",
  "remarks": "Adopted by Birsa Agricultural University water R&D consortium."
}
```
