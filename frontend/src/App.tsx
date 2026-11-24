import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [message, setMessage] = useState("Chargement...");

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setMessage(res.data.message))
      .catch(() => setMessage("Impossible de joindre l'API"));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Boutique Informatique</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;