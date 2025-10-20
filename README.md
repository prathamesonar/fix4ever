# Fix4Ever - Service Request & Tracking System Prototype

Fix4Ever is a prototype for a real-time, multi-vendor service marketplace where users can book and track repair technicians for home/electronic services. This project was developed as a full-stack challenge to demonstrate capabilities across frontend, backend, database integration, and basic AI automation.

## Table of Contents

- [Description](#description)
- [Key Features](#key-features)
  - [User Features](#user-features)
  - [Technician Features](#technician-features)
  - [Admin Features](#admin-features)
  - [General Features](#general-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Live Demo](#live-demo)
- [Author](#author)

## Description

This application simulates a service marketplace allowing users to submit requests for repairs. Technicians can view and accept available jobs based on category, update job statuses, and manage their profiles. An admin panel provides an overview of users and requests, along with basic management capabilities. The system also includes an AI feature to suggest request details based on the user's description.

## Key Features

### User Features

-   **Authentication:** Register and log in as a User.
-   **Dashboard:** View personal service requests with status tracking.
-   **Filter Requests:** Filter requests by status (All, Active, Completed).
-   **New Service Request:**
    -   Create new service requests with description and address.
    -   **AI Suggestions:** Get AI-powered suggestions for category, estimated duration/price, and urgency based on the description.
    -   **Technician Selection:** View available technicians filtered by the suggested category and optionally select a preferred technician.
    -   **Scheduling:** Optionally suggest a preferred date and time slot.
-   **Edit Request:** Modify pending requests (description, category, address, schedule).
-   **Cancel Request:** Cancel requests that are Pending, Assigned, or In Progress.
-   **Review Technician:** Submit a star rating (1-5) and optional text review for completed jobs.
-   **View Technician Profile:** Click on an assigned technician's name to view their public profile.
-   **Service History:** View a list of completed and cancelled requests.
-   **Settings:** Change account password.
-   **Delete Account:** Option to permanently delete the user account.

### Technician Features

-   **Authentication:** Register and log in as a Technician, specifying specialty.
-   **Dashboard:**
    -   View assigned jobs ('My Jobs'), filterable by status ('Active', 'Completed').
    -   View 'Available Service Requests'.
    -   Filter available requests by category.
    -   Sort available requests to show urgent ones first.
    -   View customer name, address, description, AI estimates, and schedule preferences for available jobs.
-   **Accept Job:** Accept available 'Pending' requests.
-   **Update Status:** Mark assigned jobs as 'In Progress' and 'Completed'.
-   **View Profile Details:** See own availability status and average rating on the dashboard.
-   **Settings:**
    -   Toggle availability status.
    -   Update profile information (Name, Specialty, Bio, Years Experience, Certifications).
    -   Change account password.
-   **Delete Account:** Option to permanently delete the technician account.
-   **Service History:** View own completed and cancelled jobs.

### Admin Features

-   **Special Login:** Log in using credentials stored in the backend `.env` file via a dedicated checkbox.
-   **Dashboard:**
    -   View key statistics (Total Users, Technicians, Pending/Active/Completed Jobs).
    -   View a list of top-rated technicians.
-   **User Management:** View a table of all registered users.
-   **Request Management:** View a table of all service requests.
-   **Delete User:** Delete users (with confirmation prompt). Cannot delete self.
-   **Delete Request:** Delete service requests (with confirmation prompt).
-   **View Technician Profile:** Click links to view technician profiles from user/request tables.

### General Features

-   **Responsiveness:** UI adapts to different screen sizes (Desktop, Mobile) using Tailwind CSS.
-   **Notifications:** User feedback provided via toast-like notifications for actions like login, request creation, deletion, etc..
-   **JWT Authentication:** Secure API endpoints using JSON Web Tokens.
-   **Password Hashing:** User passwords are securely hashed using bcryptjs before storing.

## Tech Stack

-   **Frontend:** React (Vite), React Router, Axios, Tailwind CSS
-   **Backend:** Node.js, Express
-   **Database:** MongoDB (Mongoose ODM)
-   **Authentication:** JWT (jsonwebtoken), bcryptjs
-   **AI Integration:** Sarvam AI API (via Axios)

## Project Structure

```

.
├── backend/
│   ├── controllers/      \# Handles request logic (auth, requests, admin, AI, technicians)
│   ├── middleware/       \# Custom middleware (e.g., auth checks)
│   ├── models/           \# Mongoose schemas (User, ServiceRequest)
│   ├── routes/           \# Express route definitions
│   ├── utils/            \# Utility functions (e.g., generateToken)
│   ├── .env              \# Environment variables (DB connection, secrets, API keys) - \!\!\! DO NOT COMMIT \!\!\!
│   ├── .gitignore
│   ├── index.js          \# Main backend server entry point
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/           \# Static assets
│   ├── src/
│   │   ├── components/   \# Reusable React components (Header, Footer, PrivateRoute, etc.)
│   │   ├── context/      \# React Context for global state (AuthContext)
│   │   ├── pages/        \# Page-level components corresponding to routes
│   │   ├── services/     \# API service configuration (Axios instance)
│   │   ├── App.jsx       \# Main application component with routing
│   │   ├── index.css     \# Tailwind CSS entry point
│   │   └── main.jsx      \# Frontend application entry point
│   ├── .gitignore
│   ├── index.html        \# Main HTML file
│   ├── jsconfig.json     \# JS project configuration (for VS Code paths)
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js \# PostCSS configuration (for Tailwind/Autoprefixer)
│   ├── tailwind.config.js\# Tailwind CSS configuration
│   └── vite.config.js    \# Vite build tool configuration
└── README.md             \# This file

````

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Backend Setup:**
    * Navigate to the backend directory:
        ```bash
        cd backend
        ```
    * Install dependencies:
        ```bash
        npm install
        ```
    * Create a `.env` file in the `backend` directory. Copy the contents of `.env.example` (if provided) or add the necessary variables (see [Environment Variables](#environment-variables) section below).
    * Run the backend server:
        ```bash
        npm run dev
        ```
        The server should start, typically on port 5001, and attempt to connect to MongoDB.

3.  **Frontend Setup:**
    * Open a **new terminal** and navigate to the frontend directory:
        ```bash
        cd ../frontend
        ```
    * Install dependencies:
        ```bash
        npm install
        ```
    * Run the frontend development server:
        ```bash
        npm run dev
        ```
        Vite will start the development server, usually on port 5173.

4.  **Access the Application:** Open your web browser and navigate to `http://localhost:5173`.

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```dotenv
# Port for the backend server (default is 5001)
PORT=5001

# MongoDB Connection String (replace with your Atlas connection string)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# Secret key for signing JWT tokens (choose a long, random string)
JWT_SECRET=your_super_secret_jwt_key_here

# API Key for Sarvam AI (obtain from Sarvam AI)
SARVAM_API_KEY=sk_your_sarvam_api_key_here

# Credentials for the special Admin login
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
````

**Notes:**

  * **MONGO\_URI:** Get this from your MongoDB Atlas cluster connection details.
  * **JWT\_SECRET:** Create a strong, random secret key.
  * **SARVAM\_API\_KEY:** Obtain this key from the Sarvam AI platform.
  * **ADMIN\_EMAIL / ADMIN\_PASSWORD:** Set the desired credentials for the special admin login. **Ensure a user with this email and `role: "Admin"` exists in your MongoDB database.**
  * **Security:** Ensure the `.env` file is listed in your `.gitignore` file and never commit it to version control.

## Usage

1.  **Register:** Navigate to `/register` to create a 'User' or 'Technician' account.
2.  **Login:** Navigate to `/login` to log in.
      * **Normal Users/Technicians:** Enter registered email/password.
      * **Admin:** Enter the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the `.env` file and **check the "Login as Admin (Special)" box**.
3.  **Explore:**
      * **Users:** Create requests from `/new-request`, view status on `/dashboard`.
      * **Technicians:** View/accept jobs on `/tech-dashboard`.
      * **Admin:** Access the admin panel via `/admin`.
      * Access Settings and History via header links (if applicable to the role).

## Screenshots

*(Add screenshots of your application here)*

  * **Homepage:**
    `[Placeholder for Homepage Screenshot]`
  * **Login Page:**
    `[Placeholder for Login Page Screenshot]`
  * **Register Page:**
    `[Placeholder for Register Page Screenshot]`
  * **User Dashboard:**
    `[Placeholder for User Dashboard Screenshot]`
  * **New Request Page (with AI suggestions):**
    `[Placeholder for New Request Page Screenshot]`
  * **Technician Dashboard:**
    `[Placeholder for Technician Dashboard Screenshot]`
  * **Technician Profile Page:**
    `[Placeholder for Technician Profile Screenshot]`
  * **Admin Dashboard:**
    `[Placeholder for Admin Dashboard Screenshot]`
  * **Settings Page:**
    `[Placeholder for Settings Page Screenshot]`

## Live Demo

*(Add a link to your deployed application or a video demonstration)*
```
