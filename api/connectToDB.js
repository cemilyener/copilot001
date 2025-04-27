import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Ortam değişkeninden bağlantı dizisini al
let cachedClient = null;

export default async function handler(req, res) {
  try {
    // MongoDB'ye daha önce bağlanmamışsak yeni bir bağlantı oluştur
    if (!cachedClient) {
      cachedClient = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await cachedClient.connect();
    }

    const db = cachedClient.db("copilotDB"); // Veritabanı adı
    const collection = db.collection("users"); // Koleksiyon adı

    if (req.method === "GET") {
      // Kullanıcı verilerini al
      const users = await collection.find().toArray();
      return res.status(200).json({ success: true, data: users });
    } else if (req.method === "POST") {
      // Yeni kullanıcı ekle
      const { name, email } = req.body;
      const result = await collection.insertOne({ name, email });
      return res.status(201).json({ success: true, data: result });
    } else {
      return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}