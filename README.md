# 🌿 AgriChain: Blockchain-Based Agricultural Supply Chain

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Stack: MERN](https://img.shields.io/badge/Stack-MERN-blue?logo=mongodb&logoColor=white)](https://www.mongodb.com/mern-stack)
[![Backend: Render](https://img.shields.io/badge/Backend-Render-darkblue)](https://render.com)
[![Frontend: Vercel](https://img.shields.io/badge/Frontend-Vercel-black)](https://vercel.com)
[![Node: v18+](https://img.shields.io/badge/Node.js-v18%2B-brightgreen?logo=nodedotjs)](https://nodejs.org/)
[![React: v19](https://img.shields.io/badge/React-v19-61DAFB?logo=react&logoColor=white)](https://react.dev/)

**AgriChain** is a production-grade **MERN stack** application that brings full transparency to the agricultural supply chain using immutable blockchain technology. From the genesis block at the farm to the final scan at the consumer's table, every hand-off is recorded, verified, and secured on-chain.

---

## 🚀 Live Demo

| Service | URL |
| :--- | :--- |
| 🖥️ **Dashboard** | [blockchain-based-supply-chain-trans.vercel.app](https://blockchain-based-supply-chain-trans.vercel.app/) |
| ⚙️ **API Health** | [/api/test](https://blockchain-based-supply-chain.onrender.com/api/test) |
| 📱 **Mobile Scanner** | [/scan.html](https://blockchain-based-supply-chain.onrender.com/scan.html) |

> **Note:** The backend is hosted on Render's free tier and may have a cold-start delay of ~30 seconds on first request.

---

## ✨ Key Features

### 🔐 Immutable Blockchain Ledger
Every product batch is treated as a mini blockchain. Each lifecycle event (Farming → Processing → Distribution → Retail) creates a new block cryptographically linked to the previous one via **SHA-256 hashing**, guaranteeing tamper-proof data integrity.

### 📱 Dynamic QR Code Ecosystem
A unique QR code is generated for every batch at creation. Consumers simply scan the QR code on their mobile device to instantly view the **complete farm-to-table journey**, including origin, temperature logs, and the actor responsible at each stage.

### 🌡️ Real-Time Anomaly Detection
Built-in environmental monitoring flags batches that exceed safe temperature or humidity thresholds at any stage. Anomalies are surfaced immediately on the dashboard for supply chain managers to act on.

### 📊 Live Operations Dashboard
A professional React dashboard showing high-level supply chain KPIs:
- **Total Blocks** — Length of the immutable chain
- **Active Batches** — Products currently in transit
- **At-Risk Batches** — Batches flagged with anomalies

### ✅ Chain Integrity Verification
A dedicated `/api/verify` endpoint rehashes the entire chain on demand and validates every block's `previousHash` linkage, providing cryptographic proof that no record has been tampered with.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 (Vite), Lucide Icons, QRCode.react, TailwindCSS | Dashboard UI & QR generation |
| **Backend** | Node.js, Express.js | REST API server |
| **Database** | MongoDB Atlas (Mongoose ODM) | Persistent batch & ledger storage |
| **Blockchain** | Custom SHA-256 Linked-List Ledger | Immutable record keeping |
| **Mobile Scanner** | Vanilla HTML/JS (`scan.html`) | Consumer-facing QR scan page |
| **Deployment** | Vercel (Frontend), Render (Backend) | Cloud hosting |

---

## 📦 Project Structure

```text
Blockchain-based-Supply-chain-Transparency-for-Agricultural-Procedure/
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB Atlas connection
│   ├── controllers/
│   │   └── productController.js # All business logic & SHA-256 hashing
│   ├── models/
│   │   ├── Product.js           # Core batch/product schema
│   │   ├── BlockchainTransaction.js # On-chain event schema
│   │   ├── Farmer.js            # Farmer entity schema
│   │   ├── Shipment.js          # Shipment record schema
│   │   └── User.js              # User/actor schema
│   ├── routes/
│   │   └── productRoutes.js     # All Express API route definitions
│   ├── server.js                # App entry point, middleware, static serving
│   └── seed.js                  # Script to populate DB with demo data
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Root React component (all views)
│   │   ├── main.jsx             # React DOM entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static assets
│   ├── index.html               # HTML shell
│   ├── vite.config.js           # Vite build configuration
│   └── vercel.json              # Vercel deployment config (SPA rewrites)
└── templates/
    └── scan.html                # Mobile-optimized QR scan & journey viewer
```

---

## 🛠️ Local Setup & Installation

### Prerequisites
- [Node.js v18+](https://nodejs.org/)
- [npm v9+](https://www.npmjs.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/Blockchain-based-Supply-chain-Transparency-for-Agricultural-Procedure.git
cd Blockchain-based-Supply-chain-Transparency-for-Agricultural-Procedure
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/agrichain
PORT=5000
```

Start the server:
```bash
# Production
npm start

# Development (with hot-reload via nodemon)
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

### 4. Seed Demo Data (Optional)
Populate your local MongoDB with realistic agricultural batch data for testing:
```bash
cd backend
node seed.js
```

---

## 📜 API Reference

Base URL: `https://blockchain-based-supply-chain.onrender.com`

### Products & Batches

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve all tracked batches |
| `POST` | `/api/products` | Register a new batch (Genesis Block) |
| `POST` | `/api/products/:batchId/stage` | Append a new lifecycle stage to a batch |
| `GET` | `/api/products/:batchId/trace` | Fetch the full blockchain journey for a batch |

### Chain & Dashboard

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/stats` | Get dashboard KPIs (total, active, at-risk) |
| `GET` | `/api/chain` | Retrieve the entire ledger chain |
| `GET` | `/api/verify` | Cryptographically validate the full chain integrity |

### QR Tracking

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/trace/:batchId` | Full trace data for mobile QR scan page |

### Utility

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/test` | Backend health check |
| `GET` | `/health` | Server liveness probe |

---

## 📱 Mobile QR Scanner Flow

1. A batch is registered via the dashboard → a unique **QR code** is generated.
2. The QR code encodes a URL pointing to `scan.html?batch=<batchId>`.
3. Consumer scans the QR → `scan.html` fetches `/api/trace/:batchId`.
4. The mobile page renders the **full farm-to-table blockchain journey** with each stage's actor, timestamp, location, temperature, and block hash.

---

## 🔒 Blockchain Architecture

Each product batch maintains an internal chain of stage blocks:

```
[Genesis Block: Farm]
      │  previousHash: "0"
      ▼
[Block 2: Processing]
      │  previousHash: SHA256(Block 1)
      ▼
[Block 3: Distribution]
      │  previousHash: SHA256(Block 2)
      ▼
[Block 4: Retail]
         previousHash: SHA256(Block 3)
```

- Each block stores: `stage`, `actor`, `location`, `temperature`, `humidity`, `timestamp`, `hash`, `previousHash`
- Chain integrity is validated by re-computing every block's SHA-256 hash and checking linkage

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub and connect repo to Vercel
# Set VITE_API_URL env var in Vercel project settings
```

### Backend → Render
- Connect your GitHub repo to [Render](https://render.com)
- Set **Root Directory** to `backend`
- **Start Command**: `npm start`
- Add `MONGODB_URI` and `PORT` as environment variables in Render dashboard

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Developed with 🌿 for a Transparent & Trustworthy Food System.</strong>
</div>
