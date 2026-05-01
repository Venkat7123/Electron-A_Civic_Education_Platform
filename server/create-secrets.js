require("dotenv").config();
const { execSync } = require("child_process");
const fs = require("fs");

const project = "smartflow-492713";
const secrets = [
  "GEMINI_API_KEY",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY"
];

for (const key of secrets) {
  const value = process.env[key];
  if (!value) {
    console.warn(`Warning: ${key} not found in .env`);
    continue;
  }
  
  console.log(`Creating secret ${key}...`);
  try {
    // Check if secret exists
    execSync(`gcloud secrets describe ${key} --project=${project}`, { stdio: "ignore" });
    console.log(`Secret ${key} already exists. Adding new version...`);
  } catch (e) {
    // Create secret if it doesn't exist
    execSync(`gcloud secrets create ${key} --project=${project} --replication-policy=automatic`);
  }

  // Create temporary file for the value to handle newlines correctly
  const tempFile = `temp_${key}.txt`;
  // Unescape newlines if they are literal \n in the string
  const formattedValue = value.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
  fs.writeFileSync(tempFile, formattedValue);
  
  try {
    execSync(`gcloud secrets versions add ${key} --project=${project} --data-file=${tempFile}`);
    console.log(`Added value to ${key}`);
  } catch (e) {
    console.error(`Failed to add value to ${key}`, e.message);
  } finally {
    fs.unlinkSync(tempFile);
  }
}
console.log("Done.");
