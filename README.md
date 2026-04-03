# 🌿 AgriChain: Blockchain-Based Agricultural Supply Chain

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Stack: MERN](https://img.shields.io/badge/Stack-MERN-blue?logo=mongodb&logoColor=white)](https://www.mongodb.com/mern-stack)
[![Backend: Render](https://img.shields.io/badge/Backend-Render-darkblue)](https://render.com)
[![Frontend: Vercel](https://img.shields.io/badge/Frontend-Vercel-black)](https://vercel.com)

**AgriChain** is a production-grade MERN stack application designed to revolutionize transparency in the agricultural supply chain using immutable blockchain technology. From the genesis block at the farm to the final scan at the consumer's table, every hand-off is recorded, verified, and secured.

---

## 🚀 Live Demo
- **Dashboard**: [https://blockchain-based-supply-chain-trans.vercel.app/](https://blockchain-based-supply-chain-trans.vercel.app/)
- **API Health**: [https://blockchain-based-supply-chain.onrender.com/api/test](https://blockchain-based-supply-chain.onrender.com/api/test)
- **Mobile Scanner**: [https://blockchain-based-supply-chain.onrender.com/scan.html](https://blockchain-based-supply-chain.onrender.com/scan.html)

---

## ✨ Key Features

### 🔐 Immutable Ledger
Every product batch is treated as a blockchain. Each lifecycle event (Processing, Distribution, Retail) creates a new block linked to the previous one via **SHA-256 hashing**, ensuring data integrity that cannot be altered retroactively.

### 📱 Dynamic QR Ecosystem
Integrated QR code generation for every batch. Consumers can scan the product on their mobile device to instantly view the entire journey, including origin, temperature history, and responsible actors.

### 🌡️ Anomaly Detection
Built-in monitoring for environmental breaches. If a batch exceeds safe temperature or humidity thresholds during any stage, the system flags it as an **anomaly** on the dashboard.

### 📊 Real-Time Dashboard
A professional Mint-Green/Cream interface providing high-level statistics:
- **Total Blocks** (Chain length)
- **Active Batches** (In-transit products)
- **At-Risk Batches** (Anomaly flags)

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Lucide Icons, QRCode.react |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **Blockchain** | Custom SHA-256 Linked-List Ledger |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📦 Project Structure
```text
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # API logic
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # Express API Endpoints
│   ├── server.js        # Entry point
│   └── seed.js          # Production Data Seeding
├── frontend/
│   ├── src/             # React Application
│   └── public/          # Static Assets
└── templates/           # Mobile Scan Interface
```

---

## 🛠️ Installation & Setup

### 1. Prerequisite
- Node.js (v18+)
- MongoDB Atlas Account

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your .env file with MONGODB_URI and JWT_SECRET
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Set VITE_API_URL in .env to your backend URL
npm run dev
```

### 4. Data Seeding (Optional)
To populate your dashboard with experimental agricultural batches:
```bash
cd backend
node seed.js
```

---

## 📜 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all tracked batches |
| `POST` | `/api/products` | Register a new batch (Genesis) |
| `GET` | `/api/products/:id/trace` | Fetch the full blockchain journey |
| `POST` | `/api/products/:id/stage` | Append a new stage to the ledger |
| `GET` | `/api/verify` | Validate the entire chain's integrity |

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed with 🌿 for a Transparent World.**
