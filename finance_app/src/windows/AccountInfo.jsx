import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./AccountInfo.css";
import Footer from "../Components/Footer"
import CircularButton from "../Components/CircularButton"; 
import Button from "../Components/Button"; 
import Input from "../Components/Input"; 

function AccountInfo() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [history, setHistory] = useState([]);
  const [budget, setBudget] = useState(""); 
  const [days, setDays] = useState(""); 
  const [showForm, setShowForm] = useState(false);
  const [historyB, setHistoryB] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

 

  const validarDatos = () => {
    setMensaje("");

    const amount = Number(budget);
    const period = Number(days);

    if (isNaN(amount) || amount <= 0) {
      setMensaje("Ingrese un monto válido mayor a 0");
      return false;
    }

    if (isNaN(period) || period <= 0) {
      setMensaje("Ingrese una cantidad de días válida");
      return false;
    }

    return true;
  };

  const createBudget = async () => {

    if(!validarDatos()) return; 

    try{
      const res = await fetch("http://localhost:3227/createBudget", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accountId: account.id_account, 
          amount: Number(budget),
          days: Number(days)
        })
      }); 

      const data = await res.json();

      if (res.ok) {
        console.log("Budget creado");
        setShowForm(false)

        setBudget("");
        setDays("");

        const updated = await fetch(`http://localhost:3227/account/${id}`);
        const newData = await updated.json();
        setAccount(newData);

      } else {
        console.log(data);
      }

    } catch(error){
      console.error(error);
    }
  };

  useEffect(() => {
        fetch(`http://localhost:3227/historyBudget/${id}`)
            .then(res => res.json())
            .then(data => setHistory(data))
            .catch(err => console.error(err));
    }, []);

  useEffect(() => {
    fetch(`http://localhost:3227/account/${id}`)
      .then((res) => res.json())
      .then((data) => setAccount(data))
      .catch((err) => console.log(err));
    }, [id]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:3227/historybudget/${account.id_account}`);
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!account) return <p>Cargando...</p>;

  const now = new Date();
  const end = account.end ? new Date(account.end) : null;

  const isExpired = end && now > end;

  return (
    <div className = "AccountInf">

      {account.type_name === "Gasto" ? (
        <>

          <button className="back-btn" onClick={() => navigate(-1)}>
              Volver
          </button>

          {showForm && (
            <div className="budget"
            onClick={() => setShowForm(false)}>
              <div className="budget-form"
              onClick={(e) => e.stopPropagation()}>

                {mensaje && <p className="mensaje">{mensaje}</p>}

                <Input
                  label = "Monto del presupuesto"
                  type = "number"
                  placeholder= "Ingrese monto para el presupuesto"
                  value = {budget}
                  onChange={(e) => {
                    setBudget(e.target.value);
                    setMensaje("");
                  }}
                />

                <Input
                  label = "Periodo en días del presupuesto"
                  type = "number"
                  placeholder= "Ingrese la cantidad de días"
                  value = {days}
                  onChange={(e) => {
                    setDays(e.target.value);
                    setMensaje("");
                  }}
                />

                <Button
                  text="Crear presupuesto"
                  onClick={createBudget}
                />

              </div>
            </div>
          )}

          {historyB && (
            <div className="budget"
            onClick={() => setHistoryB(false)}>
              <div className="budget-form"
              onClick={(e) => e.stopPropagation()}>
                <h1>Historial de presupuestos</h1>

                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Monto</th>
                      <th>Inicio</th>
                      <th>Fin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((b, index) => (
                      <tr key={index}>
                        <td>{Number(b.amount).toLocaleString()}</td>
                        <td>{new Date(b.start_date).toLocaleDateString()}</td>
                        <td>{new Date(b.end_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>


              </div>
            </div>
          )}

          <h2>{account.account_name}</h2>
          <p className="account-type">{account.type_name}</p>
          <div className = "balance-container">
            <h1>{account.balance.toLocaleString()} {account.iso}</h1>
          </div>

         <div className="budget-info">

          {account.budget !== null && account.budget !== undefined ? (
            isExpired ? (
              <>
                <h1>Presupuesto finalizado</h1>
                <Button text="Crear nuevo presupuesto" onClick={() => setShowForm(true)} />
              </>
            ) : (
              <>
                <h1>
                  {account.balance.toLocaleString()} / {account.budget.toLocaleString()}
                </h1>

                <Button
                  text="Ver historial"
                  onClick={() => {
                    setHistoryB(true);
                    fetchHistory();
                  }}
                />
              </>
              
            )
          ) : (
            <>
              <h1>No hay presupuesto definido</h1>
              <Button text="Poner presupuesto" onClick={() => setShowForm(true)} />
            </>
          )}

         </div>

          
        

        </>
      ) : (
        
          <>
            <button className="back-btn" onClick={() => navigate(-1)}>
                Volver
            </button>
            <h2>{account.account_name}</h2>
            <p className="account-type">{account.type_name}</p>
            <div className = "balance-container">
              <h1>{account.balance.toLocaleString()} {account.iso}</h1>
            </div>
            
            
          </>
      )} 


       
    </div>
    );
}

export default AccountInfo;