# Vibe Health Application

## Application Overview
Vibe Health is a modern web application designed to help users securely manage their health profiles and contact health professionals. The target audience includes everyday users looking for a secure platform to interact with health services. It aims to solve the problem of fragmented and unauthenticated user communications by providing a secure, streamlined platform where users can register, login, and submit authenticated contact forms.

## Technical Architecture
This application is built using a modern, scalable stack perfectly suited for serverless deployment:
- **Frontend**: Built with **React** and **Vite** for blazing fast performance and a smooth user experience.
- **Backend API**: Powered by **Python** and **FastAPI**, serving as a robust bridge between the frontend and the database.
- **Database**: **Supabase** (PostgreSQL) is used to persist real user data securely in the cloud.
- **Deployment Platform**: Both the frontend and the backend are seamlessly integrated and deployed as a single application on **Vercel** utilizing Serverless Functions.

## Usability & Core Features
- **User Authentication**: Secure registration and login flows.
- **Profile Management**: Users can securely submit personal details including their Full Name, Email, and Date of Birth.
- **Secure Submissions**: Once authenticated, users can submit private messages or forms.
- **Dashboard History**: Users can view a chronological history of their past form submissions.
- **Responsive UI**: The frontend is fully responsive and designed with a premium, accessible user interface in mind.

## Security Practices
Security is treated as a first-class citizen in this architecture:
- **Environment Variables**: Sensitive credentials such as the `SUPABASE_URL`, `SUPABASE_KEY`, and `JWT_SECRET` are strictly managed via environment variables. None of these keys are hardcoded or exposed in the frontend or backend codebase.
- **Authentication Strategy**: The application uses JSON Web Tokens (JWT) for secure, stateless session management.
- **Data Protection**: User passwords are cryptographically hashed using `bcrypt` before being stored in the database.
- **Same-Origin Policy**: By utilizing a local Vite proxy and Vercel's rewrite rules, the frontend and backend operate on the exact same domain, bypassing CORS vulnerabilities.

## Local Setup & Development
To run this project locally, you will need two terminal windows. 

First, clone the repository and ensure you have created a `.env` file at the root of the project using the `.env.example` template. Include your Supabase URL, Supabase Public Key, and a secure JWT Secret.

**Terminal 1: Start the Backend**
```bash
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn index:app --reload --port 8000
```

**Terminal 2: Start the Frontend**
```bash
cd Frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` to test the application locally. All API calls will seamlessly proxy to your Python backend.

## Deployment to Vercel
1. Push your code to a GitHub repository.
2. In Vercel, import your repository.
3. Before deploying, navigate to the **Environment Variables** tab.
4. Add `SUPABASE_URL`, `SUPABASE_KEY`, and `JWT_SECRET` using the values from your local `.env`.
5. Deploy the application. The frontend will automatically build, and the Python backend will run natively as Vercel Serverless Functions.
