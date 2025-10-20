# Fix4Ever - Service Request & Tracking System Prototype

Fix4Ever is a prototype for a real-time, multi-vendor service marketplace where users can book and track repair technicians for home/electronic services. This project was developed as a full-stack challenge to demonstrate capabilities across frontend, backend, database integration, and basic AI automation.

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
├── backend/
│   ├── controllers/     
│   ├── middleware/       
│   ├── models/           
│   ├── routes/           
│   ├── utils/            
│   ├── .env               
│   ├── .gitignore
│   ├── index.js          
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/           
│   ├── src/
│   │   ├── components/   
│   │   ├── context/      
│   │   ├── pages/        
│   │   ├── services/     
│   │   ├── App.jsx       
│   │   ├── index.css     
│   │   └── main.jsx      
│   ├── .gitignore
│   ├── index.html        
│   ├── jsconfig.json     
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js 
│   ├── tailwind.config.js
│   └── vite.config.js    
└── README.md             

````

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/prathamesonar/fix4ever.git
    cd fix4ever
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
    * Create a `.env` file in the `backend` directory. Copy the contents of `.env.example`  or add the necessary variables ( [Environment Variables](#environment-variables) section ).
    * Run the backend server:
        ```bash
        npm run dev
        ```
        The server should start on port 5001.

3.  **Frontend Setup:**
    * Open a **new terminal** and navigate to the frontend directory:
        ```bash
        cd frontend
        ```
    * Install dependencies:
        ```bash
        npm install
        ```
    * Run the frontend development server:
        ```bash
        npm run dev
        ```
        the development server will start on port 5173.

4.  **Access the Application:** Open your web browser and navigate to `http://localhost:5173`.

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```dotenv

PORT=5001
MONGO_URI=
JWT_SECRET=
SARVAM_API_KEY=

ADMIN_EMAIL=
ADMIN_PASSWORD=
````

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
