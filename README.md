# Fix4Ever - Service Request & Tracking System Prototype

Fix4Ever is a prototype for a real-time, multi-vendor service marketplace where users can book and track repair technicians for home/electronic services. This project was developed as a full-stack challenge to demonstrate capabilities across frontend, backend, database integration, and basic AI automation.
---

##  Live Demo

* **Frontend (Vercel):** [https://book-review-sand.vercel.app/](https://.vercel.app/)
* **Backend (Render):** [https://book-review-backend-5kr1.onrender.com/](http/)

---
##  Screenshots


| Home Page                                | User Dashboard                                     |
| ---------------------------------------------------- | ------------------------------------------------------ |
| ![Home Page](https://github.com/user-attachments/assets/e4e7b103-248c-4c24-8b45-cddb01894d25) | ![User Dashboard](https://github.com/user-attachments/assets/9042b8af-7c89-43c9-b22e-5e72aa7f1255) |

| New Request Page (with AI suggestions)                                      | Technician Dashboard                                     |
| ------------------------------------------------- | ------------------------------------------------------ |
| ![New Request Page (with AI suggestions)](https://github.com/user-attachments/assets/fbc5f6ab-be19-488f-a195-9b1199fb76a8) | ![Technical dashboard](https://github.com/user-attachments/assets/3516f963-ac1c-4236-ae49-0f2429e35956) |

| Technician Profile Page                                     | Admin Dashboard                                    |
| ------------------------------------------------- | ------------------------------------------------------ |
| ![Technician Profile Page](https://github.com/user-attachments/assets/0d4ea0bb-7327-4a21-9e6f-06c0ed5e637a) | ![Admin Dashboard](https://github.com/user-attachments/assets/d80180e4-c2aa-441d-b359-18b4a60a01e3) |

---
### User Features

-   **Authentication:** Register and log in as a User.
-   **Dashboard:** View personal service requests with status tracking.
-   **Filter Requests:** Filter requests by status (All, Active, Completed).
-   **New Service Request:**
    -   Create new service requests with description and address.
    -   **AI Suggestions:** Get AI-powered suggestions for category, estimated duration/price, and urgency based on the description.
    -   **Technician Selection:** View available technicians filtered by the suggested category and optionally select a preferred technician.
    -   **Scheduling:** Optionally suggest a preferred date and time slot.
-   **Edit and Cancel Request:** Modify pending requests (description, category, address, schedule).
-   **Review Technician:** Submit a star rating (1-5) and optional text review for completed jobs.


### Technician Features

-   **Authentication:** Register and log in as a Technician, specifying specialty.
-   **Dashboard:**
    -   View assigned jobs ('My Jobs'), filterable by status ('Active', 'Completed').
    -   View customer name, address, description, AI estimates, and schedule preferences for available jobs.
-   **Accept Job:** Accept available 'Pending' requests.
-   **Update Status:** Mark assigned jobs as 'In Progress' and 'Completed'.
-   **View Profile Details:** See own availability status and average rating on the dashboard.
-   **Service History:** View own completed and cancelled jobs.

### Admin Features

-   **Login:** Log in using credentials stored in the backend `.env` file via a dedicated checkbox.
-   **Dashboard:**
    -   View key statistics (Total Users, Technicians, Pending/Active/Completed Jobs).
    -   View a list of top-rated technicians.
-   **User Management:** View a table of all registered users.
-   **Request Management:** View a table of all service requests.
-   **Delete Request and user:** Delete service requests, users.

---

## Tech Stack

-   **Frontend:** React (Vite), React Router, Axios, Tailwind CSS
-   **Backend:** Node.js, Express
-   **Database:** MongoDB (Mongoose ODM)
-   **Authentication:** JWT (jsonwebtoken), bcryptjs
-   **AI Integration:** Sarvam AI API (via Axios)
-   
---

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
---

## ⚙️ Local Setup and Installation

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
---

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```dotenv

PORT=5001
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret_key
SARVAM_API_KEY=api_key

ADMIN_EMAIL=
ADMIN_PASSWORD=
````

