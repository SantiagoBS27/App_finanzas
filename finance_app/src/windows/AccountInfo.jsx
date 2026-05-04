import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./AccountInfo.css";
import Footer from "../Components/Footer"

function AccountInfo() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3227/account/${id}`)
      .then((res) => res.json())
      .then((data) => setAccount(data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!account) return <p>Cargando...</p>;

  return (
    <>
    
    
    <button className="back-btn" onClick={() => navigate(-1)}>
        Volver
    </button>

    <div className="accountinfo-container">
        <h1 className="accountinfo-title">{account.account_name}</h1>
        <br></br>
        <br></br>
        <div className="accountinfo-grid">

        <div className="info-card">
            <h3>Balance de la cuenta</h3>
            <p>{account.balance}</p>
        </div>

        <div className="info-card">
            <h3>Tipo de moneda</h3>
            <p>{account.iso}</p>
        </div>

        <div className="info-card">
            <h3>Tipo de la cuenta</h3>
            <p>{account.type_name}</p>
        </div>

        <div className="info-card">
            <h3>Fecha de creacion</h3>
            <p>{account.created_at}</p>
        </div>

        </div>
    </div>
    <Footer></Footer>
    </>
);
}

export default AccountInfo;