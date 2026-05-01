const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  try {
    const genAI = new GoogleGenerativeAI("AIzaSyDrDq3qgxItcA6kO6Yf5_kFJ2eIqRibDiA");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log(result.response.text());
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
