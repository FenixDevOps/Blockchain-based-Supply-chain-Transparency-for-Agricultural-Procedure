const mongoose = require('mongoose');
const dotenv = require('dotenv');
const crypto = require('crypto');
const QRCode = require('qrcode');

const Product = require('./models/Product');
const Farmer = require('./models/Farmer');
const BlockchainTransaction = require('./models/BlockchainTransaction');
const connectDB = require('./config/db');

dotenv.config();

const generateHash = (index, previousHash, timestamp, data, nonce) => {
  return crypto.createHash('sha256').update(String(index) + previousHash + timestamp + JSON.stringify(data) + String(nonce)).digest('hex');
};

const createMockProduct = async (name, cropType, farmerName, origin, kg, temp, hum, notes) => {
    let farmer = await Farmer.findOne({ name: farmerName });
    if (!farmer) farmer = await Farmer.create({ name: farmerName, location: origin });

    const isAnomalous = temp > 30 || hum > 80;
    const batchId = crypto.randomBytes(4).toString('hex').toUpperCase();

    const trackingUrl = `http://192.168.1.142:5000/scan.html?batch=${batchId}`;
    const qrCodeImage = await QRCode.toDataURL(trackingUrl, { color: { dark: '#000000', light: '#ffffff' } });

    const lastTx = await BlockchainTransaction.findOne().sort({ index: -1 });
    const prevHash = lastTx ? lastTx.hash : "0";
    const newIndex = lastTx ? lastTx.index + 1 : 0;
    
    const txData = { 
      batch_id: batchId, event: "Product Created", role: "Farmer", actor: farmerName, 
      location: origin, details: { name, crop_type: cropType, quantity_kg: kg, certifications: ["Organic Certified"] },
      temperature_c: temp, humidity_pct: hum, is_anomalous: isAnomalous, notes: notes
    };
    
    const timestampISO = new Date().toISOString();
    const hash = generateHash(newIndex, prevHash, timestampISO, txData, 0);

    const blockTx = await BlockchainTransaction.create({
      index: newIndex, timestamp: timestampISO, data: txData, previousHash: prevHash, hash, nonce: 0
    });

    const product = await Product.create({
      batchId, name, cropType, farmerId: farmer._id, origin, 
      quantityKg: kg, temperatureC: temp, humidityPct: hum, 
      isAnomalous, qrCodeImage, blockchainTxId: blockTx._id
    });

    return batchId;
};

const addMockStage = async (batchId, role, actor, location, temp, hum, details, notes) => {
    const product = await Product.findOne({ batchId });
    if (!product) return;

    const isAnomalous = temp > 30 || hum > 80;
    if (isAnomalous) { product.isAnomalous = true; await product.save(); }

    const lastTx = await BlockchainTransaction.findOne().sort({ index: -1 });
    const prevHash = lastTx ? lastTx.hash : "0";
    const newIndex = lastTx ? lastTx.index + 1 : 0;

    const txData = {
      batch_id: batchId, event: `${role} Stage`, role, actor,
      location, details, temperature_c: temp,
      humidity_pct: hum, is_anomalous: isAnomalous, notes
    };

    const timestampISO = new Date().toISOString();
    const hash = generateHash(newIndex, prevHash, timestampISO, txData, 0);

    await BlockchainTransaction.create({
      index: newIndex, timestamp: timestampISO, data: txData, previousHash: prevHash, hash, nonce: 0
    });
};

const runSeeder = async () => {
  await connectDB();
  console.log("🗑️  Wiping existing database data...");
  await Product.deleteMany({});
  await Farmer.deleteMany({});
  await BlockchainTransaction.deleteMany({});

  console.log("🌱 Seeding products...\n");

  // ── 1. Premium Sona Masuri Rice ── Full Chain ✅
  console.log("  [1/9] Premium Sona Masuri Rice");
  const b1 = await createMockProduct("Premium Sona Masuri Rice", "Grain", "Raju Farms", "Bhongir, Telangana", 500, 26, 50, "Harvested in early morning for freshness.");
  await addMockStage(b1, "Processor", "Yadadri Mills", "Yadadri, Telangana", 25, 45, { process: "Hulling and Polishing" }, "Packed into 25kg bags");
  await addMockStage(b1, "Distributor", "Telangana AgriTrans", "Hyderabad, Telangana", 24, 40, { transport: "Covered Truck" }, "Dispatched to regional markets");
  await addMockStage(b1, "Retailer", "FreshMart Superstore", "Secunderabad, Telangana", 22, 38, { shelf: "Basmati & Rice Aisle" }, "Stocked on retail shelves");
  await addMockStage(b1, "Consumer", "End Customer", "Hyderabad, Telangana", 23, 40, { delivery: "Home delivery" }, "Delivered to customer. Chain complete.");

  // ── 2. Organic Red Chillies ── Partial Chain ✅
  console.log("  [2/9] Organic Red Chillies");
  const b2 = await createMockProduct("Organic Red Chillies", "Spice", "Srikanth Cooperative", "Yadadri, Telangana", 150, 28, 45, "Sun-dried premium grade.");
  await addMockStage(b2, "Processor", "Deccan Spice Works", "Bhongir, Telangana", 26, 40, { process: "Stem removal and grading" }, "Prepared for export");
  await addMockStage(b2, "Distributor", "Spice Route Logistics", "Warangal, Telangana", 27, 42, { transport: "Airtight container trucks" }, "En route to wholesale market");

  // ── 3. Banganapalli Mangoes ── Anomaly at Distributor ⚠️
  console.log("  [3/9] Banganapalli Mangoes (Anomaly)");
  const b3 = await createMockProduct("Banganapalli Mangoes", "Fruit", "Mani Orchards", "Bhongir, Telangana", 300, 28, 55, "Hand-picked premium quality.");
  await addMockStage(b3, "Processor", "FreshPack Co.", "Yadadri, Telangana", 27, 50, { process: "Washing and waxing" }, "Ready for transport");
  await addMockStage(b3, "Distributor", "FastTrack Logistics", "Highway Route 163", 35, 85, { transport: "Refrigerated Truck" }, "WARNING: Cooling unit failed! Extreme heat exposure.");

  // ── 4. Turmeric Rhizomes ── Full Chain ✅
  console.log("  [4/9] Nizamabad Golden Turmeric");
  const b4 = await createMockProduct("Nizamabad Golden Turmeric", "Spice", "Nizamabad Spice Guild", "Nizamabad, Telangana", 200, 27, 48, "Premium finger turmeric, 5.5% curcumin.");
  await addMockStage(b4, "Processor", "HaldiBest Processing Unit", "Nizamabad, Telangana", 26, 44, { process: "Boiling, drying and polishing" }, "Graded and bagged in 10kg units");
  await addMockStage(b4, "Distributor", "Deccan Exports Ltd.", "Hyderabad, Telangana", 24, 40, { transport: "Sealed container" }, "Shipped to export hub");
  await addMockStage(b4, "Retailer", "OrganicIndia Stores", "Jubilee Hills, Hyderabad", 22, 36, { shelf: "Organic Spices" }, "On-shelf with QR code");
  await addMockStage(b4, "Consumer", "B2B Bulk Buyer", "Mumbai, Maharashtra", 23, 38, { delivery: "Freight delivery" }, "Received by food processor. Chain complete.");

  // ── 5. Cotton Bolls ── Processor anomaly ⚠️
  console.log("  [5/9] Warangal Cotton (Anomaly)");
  const b5 = await createMockProduct("Warangal White Cotton", "Other", "Kakatiya Cotton Farms", "Warangal, Telangana", 800, 29, 55, "Premium long-staple cotton. First picking.");
  await addMockStage(b5, "Processor", "Deccan Ginning Mill", "Warangal, Telangana", 32, 82, { process: "Ginning and baling" }, "WARNING: Mill humidity exceeded safe limits during processing.");

  // ── 6. Jowar (Sorghum) ── Full Chain ✅
  console.log("  [6/9] Karimnagar Jowar");
  const b6 = await createMockProduct("Karimnagar White Jowar", "Grain", "Reddy Agri Cooperative", "Karimnagar, Telangana", 600, 25, 48, "Drought-resistant variety. Excellent grain quality.");
  await addMockStage(b6, "Processor", "Central Grain Mill", "Karimnagar, Telangana", 24, 44, { process: "Cleaning, sorting and milling" }, "120 bags packed for dispatch");
  await addMockStage(b6, "Distributor", "Telangana Food Corp.", "Hyderabad, Telangana", 23, 40, { transport: "Government vehicle" }, "PDS distribution stock");
  await addMockStage(b6, "Retailer", "Rythu Bazaar", "Koti, Hyderabad", 22, 38, { shelf: "Weekly fresh grain market" }, "Sold directly to consumers");
  await addMockStage(b6, "Consumer", "Direct Retail Buyers", "Koti Market, Hyderabad", 22, 38, { delivery: "Walk-in purchase" }, "Sold at farmer market. Full chain verified.");

  // ── 7. Sweet Limes (Mosambi) ── Partial ✅
  console.log("  [7/9] Nalgonda Mosambi");
  const b7 = await createMockProduct("Nalgonda Sweet Lime (Mosambi)", "Fruit", "Laxmi Horticulture", "Nalgonda, Telangana", 400, 27, 52, "Seedless variety, high juice content.");
  await addMockStage(b7, "Processor", "FruitFresh Graders", "Nalgonda, Telangana", 25, 48, { process: "Grading by size and color" }, "A-grade sorted for export");
  await addMockStage(b7, "Distributor", "Citrus Logistics India", "Hyderabad, Telangana", 24, 42, { transport: "Reefer van" }, "Cold chain maintained");

  // ── 8. Groundnuts ── Full Chain ✅
  console.log("  [8/9] Mahbubnagar Groundnuts");
  const b8 = await createMockProduct("Mahbubnagar Bold Groundnuts", "Grain", "Patel Groundnut Farms", "Mahbubnagar, Telangana", 350, 26, 46, "Java Bold variety. High oil content.");
  await addMockStage(b8, "Processor", "Agro Oil Works", "Mahbubnagar, Telangana", 25, 42, { process: "Shelling, sorting, oil extraction" }, "Refined groundnut oil extracted at 47%");
  await addMockStage(b8, "Distributor", "OilKing Distributors", "Hyderabad, Telangana", 24, 38, { transport: "Tanker + packaged goods" }, "Sent to retail & HORECA segment");
  await addMockStage(b8, "Retailer", "Wholesale Oils Hub", "Begum Bazaar, Hyderabad", 23, 36, { shelf: "Cooking oils" }, "On shelf, expiry labeled");
  await addMockStage(b8, "Consumer", "Restaurant & Retail Buyers", "Hyderabad Region", 24, 38, { delivery: "Bulk order fulfilled" }, "Delivered. Chain complete.");

  // ── 9. Tomatoes ── Anomaly in transit ⚠️
  console.log("  [9/9] Medchal Cherry Tomatoes (Anomaly)");
  const b9 = await createMockProduct("Medchal Cherry Tomatoes", "Vegetable", "Sunrise Polyshade Farms", "Medchal, Telangana", 120, 22, 58, "Hydroponically grown. Chemical-free.");
  await addMockStage(b9, "Processor", "VeggiFresh Packers", "Medchal, Telangana", 23, 55, { process: "Washing, sorting, punnet packing" }, "500g punnets ready for retail");
  await addMockStage(b9, "Distributor", "QuickChill Logistics", "Outer Ring Road, Hyderabad", 34, 72, { transport: "Cold Van" }, "WARNING: Vehicle AC broke down. 2hr delay in heat.");
  await addMockStage(b9, "Retailer", "GreenBasket Supermart", "Gachibowli, Hyderabad", 21, 50, { shelf: "Fresh Produce - Exotic" }, "Accepted with quality check note");

  console.log("\n✅ Database seeded successfully!");
  console.log(`   9 products | ${await BlockchainTransaction.countDocuments()} blockchain blocks\n`);
  process.exit();
};

runSeeder();
