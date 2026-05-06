import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import "./ExchangeRate.css";

function ExchangeRate() {
  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD"];

  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [date, setDate] = useState("");
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!date) {
      alert("Seleccione una fecha");
      return;
    }

    if (from === to) {
      alert("Las monedas no pueden ser iguales");
      return;
    }

    setLoading(true);
    setRate(null);

    try {
      const res = await fetch(
        `http://localhost:3227/exchange-rate?from=${from}&to=${to}&date=${date}`
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error");
      } else {
        setRate(data.rate);
      }
    } catch (error) {
      console.log(error);
      alert("Error de conexión");
    }

    setLoading(false);
  };

  return (
    

    <div className="exchange-container">

      <button className="back-btn" onClick={() => navigate(-1)}>
          Volver
      </button>

      <h1>Tipo de cambio</h1>

      <div className="exchange-box">
        <label>Moneda origen</label>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Moneda destino</label>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Button text={loading ? "Buscando..." : "Buscar"} onClick={handleSearch} />

        {rate !== null && (
          <div className="exchange-result">
            <h2>
              1 {from} = {rate} {to}
            </h2>
          </div>
        )}
      </div>
    </div>

    
  );
}

export default ExchangeRate;