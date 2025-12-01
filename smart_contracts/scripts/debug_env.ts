import * as dotenv from "dotenv";
import { resolve } from "path";

// Explicitly load the .env file
dotenv.config({ path: resolve(__dirname, ".env") });

console.log("Checking environment variables...");
console.log("SEPOLIA_URL length:", process.env.SEPOLIA_URL ? process.env.SEPOLIA_URL.length : "undefined");
console.log("PRIVATE_KEY length:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : "undefined");

if (!process.env.SEPOLIA_URL) {
    console.error("ERROR: SEPOLIA_URL is missing!");
}
if (!process.env.PRIVATE_KEY) {
    console.error("ERROR: PRIVATE_KEY is missing!");
}
