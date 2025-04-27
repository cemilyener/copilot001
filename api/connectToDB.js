import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let cachedClient = null;

export default async function handler(req, res) {
  try {
    if (!uri) {
      throw new Error("MONGODB_URI ortam değişkeni tanımlı değil.");
    }

    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }

    const db = cachedClient.db("copilotDB");
    const collection = db.collection("users");

    if (req.method === "GET") {
      const users = await collection.find().toArray();
      return res.status(200).json({ success: true, data: users });
    } else if (req.method === "POST") {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ success: false, error: "Name ve email alanları zorunludur." });
      }
      const result = await collection.insertOne({ name, email });
      return res.status(201).json({ success: true, data: result });
    } else {
      return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}