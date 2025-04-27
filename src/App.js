import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = "https://copilot001.vercel.app/api/connectToDB";

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`HTTP hatası! Durum: ${response.status}, Yanıt: ${text}`);
          });
        }
        return response.json();
      })
      .then((result) => {
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || "Bilinmeyen bir hata oluştu.");
        }
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={styles.container}>Yükleniyor...</div>;
  }

  if (error) {
    return <div style={styles.container}>Hata: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1>Kullanıcılar</h1>
      {data.length > 0 ? (
        <ul>
          {data.map((user, index) => (
            <li key={index}>{user.name} - {user.email}</li>
          ))}
        </ul>
      ) : (
        <p>Hiç kullanıcı bulunamadı.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "black",
    color: "white",
    padding: "20px",
    minHeight: "100vh",
  },
};

export default App;