# VehicleHub — Vehicle Marketplace

VehicleHub is a full-stack vehicle marketplace built with React, Vite, Express, MongoDB Atlas, and JWT authentication.

## Project structure

- `frontend/` — React + Vite website
- `backend/` — Express API, MongoDB models, and routes
- `api/index.js` — Vercel serverless API entry point
- `vercel.json` — root deployment configuration

## Local development

1. Install the backend dependencies: `cd backend && npm install`.
2. Create `backend/.env` locally (never commit it) with:
   - `MONGO_URI=<your MongoDB Atlas connection string>`
   - `JWT_SECRET=<a long random secret>`
3. Start the backend with `npm start` from `backend/`.
4. In a second terminal, run `cd frontend && npm install && npm run dev`.
5. For local frontend requests, set `VITE_API_URL=http://localhost:5000` in `frontend/.env` if the page's API helper uses it.

## Vercel deployment

Import this repository into Vercel with the **repository root** as the Root Directory. The root `vercel.json` builds the frontend and routes API requests through `api/index.js`.

Set these environment variables in Vercel Project Settings → Environment Variables for **Production, Preview, and Development** as needed:

- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — a newly generated, long random secret

After changing environment variables, redeploy the project. Confirm the deployment build succeeds, then test registration/login, vehicle listing, publishing, details, and My Listings.

## Security

Never commit `.env` files, database credentials, JWT secrets, or user passwords. If a secret was ever committed or shared publicly, changing/removing it from the latest file is not enough: rotate it at the provider and replace it in deployment environment variables. Do not use real credentials in README examples.

## Technology

- React + Vite
- Express + Mongoose / MongoDB Atlas
- bcryptjs + JSON Web Tokens
- Vercel
