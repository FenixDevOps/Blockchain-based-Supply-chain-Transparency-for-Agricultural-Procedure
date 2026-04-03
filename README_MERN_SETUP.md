# Node.js/Express Backend Setup Instructions

As requested, the backend architecture has been completely migrated to an Express.js & MongoDB (Mongoose) architecture. We have kept your frontend exactly as is, but extended it with the scanning UI.

## Environment Architecture
- The new Node.js server acts as the backend api (`http://localhost:5000`), completely replacing the Flask `app.py`.
- Mongoose replaces Python's in-memory storage dictionary.
- The `scaffold_backend.py` script automatically generated all the `models`, `routes`, `config`, and `controllers` in the `/backend` folder.

## Setup Instructions

### 1. Install Node.js Dependencies
Open a new terminal and navigate to the newly created `backend` directory.
```bash
cd backend
npm install
```

### 2. Configure MongoDB Atlas
1. Keep the `.env` file open (`backend/.env`).
2. Replace the value of `MONGODB_URI` with your actual MongoDB Atlas connection string. Make sure to embed your username and password correctly.

### 3. Start the Server
Run the Express server:
```bash
npm run dev
```
You should see:
```text
Server running on port 5000
MongoDB Connected: cluster0.xyz.mongodb.net
```

### 4. How to Use the QR Code Feature
- **Generating:** Call `POST /api/products` (defined in `backend/controllers/productController.js`). It will automatically save a Base64-encoded QR image `qrCodeImage` to the MongoDB document containing a direct link to the product tracking page.
- **Scanning UI:** We created `templates/scan.html`. Open this file in your browser. 
   - If accessed via `http://localhost:5000/scan.html?batch=XYZ`, it will automatically query MongoDB and show the tracking data.
   - If accessed directly without a batch ID, it initializes your device's camera to scan a physical QR code containing that link.
