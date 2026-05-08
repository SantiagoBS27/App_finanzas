import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./AccountInfo.css";
import Button from "../Components/Button"; 
import Input from "../Components/Input"; 

function AccountInfo() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [history, setHistory] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [budget, setBudget] = useState(""); 
  const [days, setDays] = useState(""); 

  const [showForm, setShowForm] = useState(false);
  const [historyB, setHistoryB] = useState(false);
  const [showIncome, setShowIncome] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);

  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/createBudget`, {
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

        const updated = await fetch(`${import.meta.env.VITE_API_URL}/account/${id}`);
        const newData = await updated.json();
        setAccount(newData);

      } else {
        console.log(data);
      }

    } catch(error){
      console.error(error);
    }
  };

  const income = async () => {
      try{
          const res = await fetch(`${import.meta.env.VITE_API_URL}/income`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  toAccId: account.id_account,
                  amount: Number(amount)
              })
          });

          const result = await res.text();

          if (res.ok) {
              alert("Ingreso registrado");
              setShowIncome(false);

              const updated = await fetch(`${import.meta.env.VITE_API_URL}/account/${id}`);
              const newData = await updated.json();

              setAccount(newData);
          } else {
              alert(result);
          }

      } catch (error) {
          console.error(error);
      }
  };

  const transaction = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/transaction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fromAccId: account.id_account,
                    toAccId: toAccount,
                    amount: Number(amount)
                })
            });

            const result = await res.text();

            if (res.ok) {
                alert("Transacción realizada");
                setShowTransaction(false); 
                const updated = await fetch(`${import.meta.env.VITE_API_URL}/account/${id}`);
                const newData = await updated.json();

                setAccount(newData);
            } else {
                alert(result);
            }
        } catch (error) {
            console.error(error);
        }
    };


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/account/${id}`)
      .then((res) => res.json())
      .then((data) => setAccount(data))
      .catch((err) => console.log(err));
    }, [id]);

    useEffect(() => {
      const userId = localStorage.getItem("userId");

      fetch(`${import.meta.env.VITE_API_URL}/home?userId=${userId}`)
        .then(res => res.json())
        .then(data => setAccounts(data))
        .catch(err => console.error(err));
    }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/historybudget/${account.id_account}`);
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
    <div className="AccountInf">

    <button className="back-btn" onClick={() => navigate(-1)}>
      Volver
    </button>

   
    {showForm && (
      <div
        className="budget"
        onClick={() => setShowForm(false)}
      >
        <div
          className="budget-form"
          onClick={(e) => e.stopPropagation()}
        >

          {mensaje && <p className="mensaje">{mensaje}</p>}

          <Input
            label="Monto del presupuesto"
            type="number"
            placeholder="Ingrese monto para el presupuesto"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value);
              setMensaje("");
            }}
          />

          <Input
            label="Periodo en días del presupuesto"
            type="number"
            placeholder="Ingrese la cantidad de días"
            value={days}
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
      <div
        className="budget"
        onClick={() => setHistoryB(false)}
      >
        <div
          className="budget-form"
          onClick={(e) => e.stopPropagation()}
        >

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

    
    {showIncome && (
      <div
        className="account"
        onClick={() => setShowIncome(false)}
      >
        <div
          className="account-form"
          onClick={(e) => e.stopPropagation()}
        >

          <Input
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Button
            text="Completar"
            onClick={income}
          />

        </div>
      </div>
    )}
    

    {showTransaction && (
      <div className="account"
      onClick={() => setShowTransaction(false)}>
        <div className="account-form"
        onClick={(e) => e.stopPropagation()}>
            <select onChange={(e) => setToAccount(Number(e.target.value))}>
              <option value="">Cuenta destino</option>
              {accounts
                .filter(acc =>
                  acc.id_account !== account.id_account &&
                  acc.account_name !== "Sistema"
                )
                .map(acc => (
                  <option key={acc.id_account} value={acc.id_account}>
                    {acc.account_name}
                  </option>
              ))}
            </select>

            <Input
              type="number"
              placeholder="Monto"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <Button
              text = "Completar"
              onClick={transaction} 
            />          
        </div>
      </div>
    )}

    
    <h2>{account.account_name}</h2>

    <p className="account-type">
      {account.type_name}
    </p>

    <div className={`balance-container ${account.type_name.toLowerCase()}`}>
      <h1>
        {account.balance.toLocaleString()} {account.iso}
      </h1>
    </div>

   
    {account.type_name === "Gasto" && (
      <>

        <div className="budget-info">

          {account.budget !== null && account.budget !== undefined ? (
            isExpired ? (
              <>
                <h1>Presupuesto finalizado</h1>

                <Button
                  text="Crear nuevo presupuesto"
                  onClick={() => setShowForm(true)}
                />
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

              <Button
                text="Poner presupuesto"
                onClick={() => setShowForm(true)}
              />
            </>
          )}

        </div>

      </>
    )}

    
    {account.type_name === "Ingreso" && (
      <div className="account-actions">
        <Button
          text="Registrar ingreso"
          onClick={() => {
            setShowIncome(true);
            setAmount("");
          }}
        />

        <Button
          text="Transacción"
          onClick={() => {
            setShowTransaction(true);
            setToAccount("");
            setAmount("");
          }}
        />
      </div>
    )}

   
    {account.type_name === "Activo" && (
      <div className="account-actions">

        <Button
          text="Registrar ingreso"
          onClick={() => {
            setShowIncome(true);
            setAmount("");
          }}
        />

        <Button
          text="Transacción"
          onClick={() => {
            setShowTransaction(true);
            setToAccount("");
            setAmount("");
          }}
        />

      </div>
    )}

  </div>
    );
}

export default AccountInfo;