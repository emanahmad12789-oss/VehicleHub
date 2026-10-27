# VehicleHub — Vehicle Marketplace

A real working full-stack vehicle marketplace web app with **Express backend** + **MongoDB Atlas** + **React frontend**. Designed to deploy as a single Vercel project (frontend + API together).

Built as a portfolio CS project by **Eman Ahmad** (BS Computer Science).

---

## 🚀 Quick Deploy to Vercel (5 minutes)

### Step 1: Push this folder to your GitHub repo

```bash
cd VehicleHub
git init
git branch -M main
git remote add origin https://github.com/emanahmad12789-oss/VehicleHub.git
git add .
git commit -m "Fix VehicleHub — real working website"
git push -f origin main
```

### Step 2: Delete old Vercel projects

Go to Vercel dashboard → delete both `vehicle-hub` and `vehicle-hub-7ozg` projects (they're broken and confusing).

### Step 3: Create ONE new Vercel project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import repo: `emanahmad12789-oss/VehicleHub`
3. **Leave all settings as default** — Vercel will auto-detect from `vercel.json`
4. **Add Environment Variables:**
   - `MONGO_URI` = `mongodb+srv://emanahmad12789_db_user:5hYHbFd6hJZjluEN@cluster0.vablz3f.mongodb.net/VehicleHub?retryWrites=true&w=majority`
   - `JWT_SECRET` = `aaa4c5349563b1c40a6a8552ce181b752bcdffe2cdbdde0dacc29dfb2ae4d964`
5. Click **Deploy** — done in ~2 minutes!

### Step 4: Seed vehicle data (one-time)

After the first successful deploy, run this locally to populate MongoDB with real vehicles:

```bash
cd backend
npm install
# Create .env with MONGO_URI and JWT_SECRET (same values as above)
echo 'MONGO_URI=mongodb+srv://emanahmad12789_db_user:5hYHbFd6hJZjluEN@cluster0.vablz3f.mongodb.net/VehicleHub?retryWrites=true&w=majority' > .env
echo 'JWT_SECRET=aaa4c5349563b1c40a6a8552ce181b752bcdffe2cdbdde0dacc29dfb2ae4d964' >> .env
node seed.js
```

You should see: `Seeded 11 vehicles successfully!`

### Step 5: Visit your live site!

Vercel gives you a URL like `https://vehicle-hub-xxxx.vercel.app`. Open it — you'll see:
- 11 vehicles (6 cars + 5 bikes) on home page
- Register page working
- Login working (returns JWT token)
- Add vehicle working (saves to MongoDB)
- All features real, persistent

---

## 🛠 What Was Fixed

This project had several bugs preventing it from deploying:

| Bug | Before | After |
|-----|--------|-------|
| Backend routes used full URLs as paths | `app.use("https://vehicle-hub-7ozg-three.vercel.app/api/auth", authRoutes)` | `app.use("/api/auth", authRoutes)` |
| Vercel rewrites had full URL source | `"source": "https://vehicle-hub-7ozg-three.vercel.app/api/(.*)"` | `"source": "/api/(.*)"` |
| Frontend had broken URL `http://https://...` | `fetch("http://https://vehicle-hub-7ozg-three.vercel.app/api/vehicles")` | `fetch("/api/vehicles")` |
| Login didn't return JWT token | Frontend saved `data.token` but backend never sent it | Backend now signs + returns JWT |
| Profile used double-quotes for template literals | `"/api/auth/profile/${parsedUser._id}"` (no interpolation) | `` `/api/auth/profile/${parsedUser._id}` `` |
| Cars & Bikes pages had hardcoded dummy data | 6 hardcoded cars, no API call | Now fetches real cars/bikes from MongoDB |
| VehicleCard didn't handle MongoDB `_id` | `Link to={\`/vehicle/${vehicle.id}\`}` (no _id) | Uses `vehicle._id || vehicle.id` |
| VehicleCard didn't format price number | Shown as "5850000" | Now "PKR 5,850,000" |
| No root-level `vercel.json` | Vercel couldn't find build config | Added proper root `vercel.json` |
| Vehicle schema missing fields | `type`, `brand`, `mileage`, `fuel`, `transmission`, `condition`, `color`, `city` missing | All added |
| Vehicles route didn't support filters | `?type=Car` ignored | Now filters work |

---

## 📁 Project Structure (NOT CHANGED — same as user had)

```
VehicleHub/
├── api/
│   ├── index.js             # Vercel serverless function (Express app)
│   └── vercel.json          # (legacy — kept as-is, no longer used)
├── backend/
│   ├── server.js            # Local dev Express server
│   ├── seed.js              # MongoDB seed script (NEW)
│   ├── package.json
│   ├── vercel.json
│   ├── models/
│   │   ├── user.js
│   │   └── vehicle.js
│   └── routes/
│       ├── auth.js          # register, login (JWT), profile, update
│       └── vehicles.js     # CRUD + filters + my-listings
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── api.js               # API_URL helper (same-origin on Vercel)
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/       # Navbar, Footer, VehicleCard, Toast
│       └── pages/           # 14 pages (Home, Cars, Bikes, AddVehicle, etc.)
├── src/                     # (duplicate root src — kept as-is, unused by Vercel)
├── index.html               # (duplicate root index.html — kept as-is)
├── package.json             # (root — kept as-is)
├── vite.config.js           # (root — kept as-is)
└── vercel.json              # NEW — root-level Vercel config
```

**Note**: User requested no file names be changed. So all original files are kept. The root-level `vercel.json` is the only NEW file added.

---

## 💻 Local Development

### Backend

```bash
cd backend
npm install
# Create .env:
echo 'MONGO_URI=mongodb+srv://emanahmad12789_db_user:5hYHbFd6hJZjluEN@cluster0.vablz3f.mongodb.net/VehicleHub?retryWrites=true&w=majority' > .env
echo 'JWT_SECRET=aaa4c5349563b1c40a6a8552ce181b752bcdffe2cdbdde0dacc29dfb2ae4d964' >> .env
npm install -g nodemon   # optional
node server.js
# Server runs at http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
# Create .env for local dev:
echo 'VITE_API_URL=http://localhost:5000' > .env
npm run dev
# Frontend runs at http://localhost:5173
```

Open `http://localhost:5173` — frontend calls backend at port 5000.

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
- `POST /register` — create account (returns JWT)
- `POST /login` — login (returns JWT)
- `GET /profile/:id` — get user profile
- `PUT /profile/:id` — update profile

### Vehicles (`/api/vehicles`)
- `GET /` — list all (optional filters: `?type=Car&city=Karachi&condition=Used`)
- `GET /my-listings?email=xxx` — get user's listings
- `GET /:id` — get single vehicle
- `POST /` — add vehicle
- `PUT /:id` — update vehicle
- `DELETE /:id` — delete vehicle

---

## 🛠 Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS 4 + React Router v7 + Lucide icons
- **Backend**: Express 5 + Mongoose (MongoDB Atlas)
- **Auth**: bcryptjs + JWT (jsonwebtoken)
- **Deploy**: Vercel (single project — frontend static + API serverless)

---

## 📜 License

MIT — feel free to use this for your own portfolio or learning.

Built with ❤️ by Eman Ahmad — BS Computer Science
