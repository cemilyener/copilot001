export default async function handler(req, res) {
    return res.status(200).json({ success: true, message: "Fonksiyon çalışıyor!", data: [{ name: "Ahmet Yılmaz", email: "ahmet@example.com" }] });
  }
