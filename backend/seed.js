// ============================================================
// SEED SCRIPT — Populate MongoDB Atlas with real vehicles
// ============================================================
// Run:  node seed.js
//
// Requirements: MONGO_URI in backend/.env
// ============================================================

require("dotenv").config();
const mongoose = require("mongoose");
const Vehicle = require("./models/vehicle");

const seedVehicles = [
  // ===== CARS =====
  {
    type: "Car",
    title: "Toyota Corolla Altis 2022",
    brand: "Toyota",
    make: "Toyota",
    model: "Corolla Altis",
    year: 2022,
    price: 5850000,
    mileage: "28,000 km",
    fuel: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    color: "White",
    city: "Islamabad",
    description:
      "Well maintained Toyota Corolla Altis in excellent condition. Single owner, full service history available. Company maintained, no major accidents. Best for family use.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e5b7d36e4d3?auto=format&fit=crop&w=900&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1503376780353-7e5b7d36e4d3?auto=format&fit=crop&w=900&q=80",
    sellerName: "Ahmed Raza",
    sellerEmail: "ahmed.raza@example.com",
    sellerPhone: "+92 300 1234567",
  },
  {
    type: "Car",
    title: "Honda Civic Oriel 2021",
    brand: "Honda",
    make: "Honda",
    model: "Civic Oriel",
    year: 2021,
    price: 6200000,
    mileage: "35,000 km",
    fuel: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    color: "Crystal Black",
    city: "Lahore",
    description:
      "Top variant Honda Civic Oriel with turbo engine. Sunroof, leather seats, push start, cruise control, lane watch camera.",
    images: [
      "https://images.unsplash.com/photo-1606220168510-83abc1f0d08d?auto=format&fit=crop&w=900&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1606220168510-83abc1f0d08d?auto=format&fit=crop&w=900&q=80",
    sellerName: "Sana Khan",
    sellerEmail: "sana.khan@example.com",
    sellerPhone: "+92 321 9876543",
  },
  {
    type: "Car",
    title: "Toyota Yaris ATIV 2023",
    brand: "Toyota",
    make: "Toyota",
    model: "Yaris ATIV",
    year: 2023,
    price: 4950000,
    mileage: "15,000 km",
    fuel: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    color: "White Pearl",
    city: "Rawalpindi",
    description:
      "Toyota Yaris ATIV - reliable sedan with great fuel economy. Easy maintenance, family-friendly.",
    images: [
      "https://images.unsplash.com/photo-1583121273115-727b6e7e1c4d?auto=format&fit=crop&w=900&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1583121273115-727b6e7e1c4d?auto=format&fit=crop&w=900&q=80",
    sellerName: "Bilal Hussain",
    sellerEmail: "bilal.h@example.com",
    sellerPhone: "+92 333 5555555",
  },
  {
    type: "Car",
    title: "Kia Sportage AWD 2022",
    brand: "Kia",
    make: "Kia",
    model: "Sportage AWD",
    year: 2022,
    price: 7200000,
    mileage: "22,000 km",
    fuel: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    color: "Blue",
    city: "Islamabad",
    description:
      "Kia Sportage AWD top of the line. Sunroof, ventilated seats, 360 camera, wireless charging. Excellent SUV for family trips.",
    images: [
      "https://images.unsplash.com/photo-1606664515520-4972-bf61df9c4e1d?auto=format&fit=crop&w=900&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1606664515520-4972-bf61df9c4e1d?auto=format&fit=crop&w=900&q=80",
    sellerName: "Usman Ali",
    sellerEmail: "usman.ali@example.com",
    sellerPhone: "+92 300 9999999",
  },
  {
    type: "Car",
    title: "Suzuki Alto VXL 2023",
    brand: "Suzuki",
    make: "Suzuki",
    model: "Alto VXL",
    year: 2023,
    price: 3150000,
    mileage: "12,000 km",
    fuel: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    color: "Silver",
    city: "Peshawar",
    description:
      "Suzuki Alto VXL - perfect city car with excellent fuel economy. 660cc engine, 18-22 km/l. Ideal for daily commute.",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80",
    sellerName: "Fatima Noor",
    sellerEmail: "fatima.noor@example.com",
    sellerPhone: "+92 345 1112222",
  },
  {
    type: "Car",
    title: "Honda City Aspire 2022",
    brand: "Honda",
    make: "Honda",
    model: "City Aspire",
    year: 2022,
    price: 4700000,
    mileage: "19,000 km",
    fuel: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    color: "Grey",
    city: "Lahore",
    description:
      "Honda City Aspire in showroom condition. Spacious cabin, comfortable ride, great fuel average.",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
    sellerName: "Zainab Malik",
    sellerEmail: "zainab.m@example.com",
    sellerPhone: "+92 301 4445555",
  },

  // ===== BIKES =====
  {
    type: "Bike",
    title: "Yamaha YBR 125 2023",
    brand: "Yamaha",
    make: "Yamaha",
    model: "YBR 125",
    year: 2023,
    price: 435000,
    mileage: "8,500 km",
    fuel: "Petrol",
    transmission: "Manual",
    condition: "Used",
    color: "Black",
    city: "Rawalpindi",
    description:
      "Yamaha YBR 125 - sporty commuter bike. Self start, digital meter, comfortable seat. Excellent condition.",
    images: [
      "https://images.unsplash.com/photo-1568772585407-8fd6c0fa96d3?auto=format&fit=crop&w=900&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1568772585407-8fd6c0fa96d3?auto=format&fit=crop&w=900&q=80",
    sellerName: "Sufiyan Tariq",
    sellerEmail: "sufiyan.t@example.com",
    sellerPhone: "+92 321 5556778",
  },
  {
    type: "Bike",
    title: "Honda CG 125 2024",
    brand: "Honda",
    make: "Honda",
    model: "CG 125",
    year: 2024,
    price: 285000,
    mileage: "4,000 km",
    fuel: "Petrol",
    transmission: "Manual",
    condition: "Used",
    color: "Red",
    city: "Islamabad",
    description:
      "Honda CG 125 - the legend. Most reliable 125cc bike in Pakistan. Excellent condition, well maintained.",
    images: [
      "https://images.unsplash.com/photo-1602671270536-a5c98d6d4e31?auto=format&fit=crop&w=900&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1602671270536-a5c98d6d4e31?auto=format&fit=crop&w=900&q=80",
    sellerName: "Waqas Ahmad",
    sellerEmail: "waqas.a@example.com",
    sellerPhone: "+92 311 4445556",
  },
  {
    type: "Bike",
    title: "Suzuki GS 150 2022",
    brand: "Suzuki",
    make: "Suzuki",
    model: "GS 150",
    year: 2022,
    price: 390000,
    mileage: "14,000 km",
    fuel: "Petrol",
    transmission: "Manual",
    condition: "Used",
    color: "Black",
    city: "Lahore",
    description:
      "Suzuki GS 150 - powerful and reliable. Perfect for long rides and hilly areas. Smooth engine.",
    images: [
      "https://images.unsplash.com/photo-1571068316344-75bc76f7c4f3?auto=format&fit=crop&w=900&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1571068316344-75bc76f7c4f3?auto=format&fit=crop&w=900&q=80",
    sellerName: "Ahsan Mughal",
    sellerEmail: "ahsan.m@example.com",
    sellerPhone: "+92 345 2223334",
  },
  {
    type: "Bike",
    title: "Honda CB 150F 2023",
    brand: "Honda",
    make: "Honda",
    model: "CB 150F",
    year: 2023,
    price: 480000,
    mileage: "7,000 km",
    fuel: "Petrol",
    transmission: "Manual",
    condition: "Used",
    color: "Red",
    city: "Peshawar",
    description:
      "Honda CB 150F - stylish and powerful. Sporty look, comfortable ride. Excellent for young riders.",
    images: [
      "https://images.unsplash.com/photo-1558976825-3f32d4cf4b9c?auto=format&fit=crop&w=900&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1558976825-3f32d4cf4b9c?auto=format&fit=crop&w=900&q=80",
    sellerName: "Hassan Jutt",
    sellerEmail: "hassan.j@example.com",
    sellerPhone: "+92 300 7778881",
  },
  {
    type: "Bike",
    title: "United US 70 2024",
    brand: "United",
    make: "United",
    model: "US 70",
    year: 2024,
    price: 118000,
    mileage: "3,000 km",
    fuel: "Petrol",
    transmission: "Manual",
    condition: "Used",
    color: "Black",
    city: "Abbottabad",
    description:
      "United US 70 - economical and affordable bike. Great for students and daily commuters.",
    images: [
      "https://images.unsplash.com/photo-1610486281524-3f5b1c0d6a7f?auto=format&fit=crop&w=900&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1610486281524-3f5b1c0d6a7f?auto=format&fit=crop&w=900&q=80",
    sellerName: "Naveed Iqbal",
    sellerEmail: "naveed.i@example.com",
    sellerPhone: "+92 322 9998877",
  },
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is not set in backend/.env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected to MongoDB Atlas");

    const count = await Vehicle.countDocuments();
    if (count > 0) {
      console.log(
        `\nDatabase already has ${count} vehicles.`
      );
      console.log(
        `To reseed, manually delete them first or run: Vehicle.deleteMany({}) in mongo shell.`
      );
      console.log(`\nSkipping seed.\n`);
      process.exit(0);
    }

    await Vehicle.insertMany(seedVehicles);
    console.log(
      `\nSeeded ${seedVehicles.length} vehicles successfully!\n`
    );
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
