import AccountCard from "../Components/AccountCard"; 
import CircularButton from "../Components/CircularButton"; 
import Button from "../Components/Button"; 
import Input from "../Components/Input"; 
import Sidebar from "../Components/SideBar";
import "./Home.css"; 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



function Home(){

    const [accounts, setAccounts] = useState([]);
    const [name, setName] = useState(""); 

    const [showTransaction, setShowTrans] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showIncome, setShowIncome] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    const [accountName, setAccountName] = useState("");

    const [budgets, setBudgets] = useState([]); 
    const [transactions, setTransactions] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [types, setTypes] = useState([])
    const [selectedType, setSelectedType] = useState("")

    const [searchAccount, setSearchAccount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searAmount, setSearAmount] = useState("");
    const [searchBudgetAccount, setSearchBudgetAccount] = useState("");
    const [budgetStartDate, setBudgetStartDate] = useState("");
    const [budgetEndDate, setBudgetEndDate] = useState("");
    const [budgetAmount, setBudgetAmount] = useState("");

    const [fromAccount, setFromAccount] = useState("");
    const [toAccount, setToAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [activeSection, setActiveSection] = useState("accounts");

    const navigate = useNavigate();

    const createAccount = async () => {
        const userId = localStorage.getItem("userId");
        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/createAccount`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accountName, 
                    userId: userId,
                    currencyId: selectedCurrency,
                    typeId: selectedType
                })
            }); 

            const result = await res.text(); 

            if (res.ok){
                alert("Cuenta creada");

                setShowForm(false);
                setAccountName("");

                
                const updated = await fetch(`${import.meta.env.VITE_API_URL}/home?userId=${userId}`);
                const newAccounts = await updated.json();
                setAccounts(newAccounts);
            }else{
                alert(result); 
            }
        } catch(error){
            console.error(error);
        }

    };

    const transaction = async () => {
    const userId = localStorage.getItem("userId");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/transaction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fromAccId: fromAccount,
                    toAccId: toAccount,
                    amount: Number(amount)
                })
            });

            const result = await res.text();

            if (res.ok) {
                alert("Transacción realizada");
                setShowTrans(false); 
                fetchTransactions();

                const updated = await fetch(`${import.meta.env.VITE_API_URL}/home?userId=${userId}`);
                const newAccounts = await updated.json();
                setAccounts(newAccounts);
            } else {
                alert(result);
            }
        } catch (error) {
            console.error(error);
        }
    };

const income = async () => {
    const userId = localStorage.getItem("userId");
    try{
        const res = await fetch(`${import.meta.env.VITE_API_URL}/income`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fromAccount, 
                toAccId: toAccount,
                amount: Number(amount)
            })
        });

        const result = await res.text();

        if (res.ok) {
            alert("Ingreso registrado");
            setShowIncome(false);

            fetchTransactions();

            const updated = await fetch(`${import.meta.env.VITE_API_URL}/home?userId=${userId}`);
            const newAccounts = await updated.json();
            setAccounts(newAccounts);
        } else {
            alert(result);
        }

    } catch (error) {
        console.error(error);
    }
}; 

const filteredTransactions = transactions.filter((t) => {

    const accountMatch =
        !searchAccount ||

        t.from_account
            .toLowerCase()
            .includes(searchAccount.toLowerCase()) ||

        t.to_account
            .toLowerCase()
            .includes(searchAccount.toLowerCase());

    const transactionDate = new Date(t.date);

    const dateMatch =
        (!startDate || transactionDate >= new Date(startDate)) &&
        (!endDate || transactionDate <= new Date(endDate));

    const amountMatch =
        !searAmount ||
        Number(t.amount) === Number(searAmount);

    return accountMatch && dateMatch && amountMatch;
});

const filteredBudgets = budgets.filter((b) => {

    const accountMatch =
        !searchBudgetAccount ||

        b.account_name
            .toLowerCase()
            .includes(searchBudgetAccount.toLowerCase());

    const startMatch =
        !budgetStartDate ||
        new Date(b.start_date) >= new Date(budgetStartDate);

    const endMatch =
        !budgetEndDate ||
        new Date(b.end_date) <= new Date(budgetEndDate);

    const amountMatch =
        !budgetAmount ||
        Number(b.amount) === Number(budgetAmount);

    return accountMatch &&
           startMatch &&
           endMatch &&
           amountMatch;
});

    const fetchBudgets = async () => {
        const userId = localStorage.getItem("userId");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/budgets/${userId}`);
            const data = await res.json();
            setBudgets(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTransactions = async () => {
        const userId = localStorage.getItem("userId");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/transactions/${userId}`);
            const data = await res.json();
            setTransactions(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const savedName = localStorage.getItem("name"); 

        setName(savedName);

        fetch(`${import.meta.env.VITE_API_URL}/home?userId=${userId}`)
            .then(res => res.json())
            .then(data => setAccounts(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/currencies`)
            .then(res => res.json())
            .then(data => setCurrencies(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/types`)
            .then(res => res.json())
            .then(data => setTypes(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, []);

    return(
        <div className="dashboard">

            <Sidebar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                setActiveSection={setActiveSection}
                setShowForm={setShowForm}
                fetchBudgets={fetchBudgets}
                fetchTransactions={fetchTransactions}
                setShowTrans={setShowTrans}
                setShowIncome={setShowIncome}
                setFromAccount={setFromAccount}
                setAmount={setAmount}
            />
            
            <button
                className="menu-btn"
                onClick={() => setShowSidebar(true)}
            >
                ☰
            </button>

            <div className="main-content">

                <h1>Hola, {name}!!</h1>

                {activeSection === "accounts" && (
                    <>
                        <h2>Cuentas</h2>

                        <div className="accounts-grid">

                            {accounts.map((acc) => (
                                <AccountCard
                                    key={acc.id_account}
                                    name={acc.account_name}
                                    balance={acc.balance}
                                    iso={acc.iso}
                                    type={acc.type_name}
                                    onClick={() => navigate(`/account/${acc.id_account}`)}
                                />
                            ))}

                        </div>
                    </>
                )}

                {activeSection === "history" && (
                    <div className="transaction-history">

                        <h2>Historial de transacciones</h2>

                        <div className="filters-container">

                            <Input
                                type="text"
                                placeholder="Buscar cuenta"
                                value={searchAccount}
                                onChange={(e) => setSearchAccount(e.target.value)}
                            />

                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />

                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />

                            <Input
                                type="number"
                                placeholder="Monto exacto"
                                value={searAmount}
                                onChange={(e) => setSearAmount(e.target.value)}
                            />

                            <Button
                                text="Limpiar filtros"
                                onClick={() => {
                                    setSearchAccount("");
                                    setStartDate("");
                                    setEndDate("");
                                    setSearAmount("");
                                }}
                            />

                        </div>

                        <div className="table-history">

                            <table className="tableT">

                                <thead>
                                    <tr>
                                        <th>Cuenta origen</th>
                                        <th>Cuenta destino</th>
                                        <th>Monto</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredTransactions.map((t, index) => (
                                        <tr key={index}>
                                            <td>{t.from_account}</td>
                                            <td>{t.to_account}</td>
                                            <td>{Number(t.amount).toLocaleString()}</td>
                                            <td>{new Date(t.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>

                    </div>
                )}

                {activeSection === "budgets" && (

                    <div className="transaction-history">

                        <h2>Historial de presupuestos</h2>

                        <div className="filters-container">

                            <Input
                                type="text"
                                placeholder="Buscar cuenta"
                                value={searchBudgetAccount}
                                onChange={(e) => setSearchBudgetAccount(e.target.value)}
                            />

                            <Input
                                type="date"
                                value={budgetStartDate}
                                onChange={(e) => setBudgetStartDate(e.target.value)}
                            />

                            <Input
                                type="date"
                                value={budgetEndDate}
                                onChange={(e) => setBudgetEndDate(e.target.value)}
                            />

                            <Input
                                type="number"
                                placeholder="Monto exacto"
                                value={budgetAmount}
                                onChange={(e) => setBudgetAmount(e.target.value)}
                            />

                            <Button
                                text="Limpiar filtros"
                                onClick={() => {
                                    setSearchBudgetAccount("");
                                    setBudgetStartDate("");
                                    setBudgetEndDate("");
                                    setBudgetAmount("");
                                }}
                            />

                        </div>

                        <div className="table-history">

                            <table className="tableT">

                                <thead>
                                    <tr>
                                        <th>Cuenta</th>
                                        <th>Monto</th>
                                        <th>Inicio</th>
                                        <th>Fin</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredBudgets.map((b, index) => (
                                        <tr key={index}>
                                            <td>{b.account_name}</td>
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

            </div>

            {showForm && (
                <div className="account" 
                onClick={() => setShowForm(false)}>
                    <div className="account-form"
                    onClick={(e) => e.stopPropagation()}>
                        <Input
                            label = "Nombre de la cuenta"
                            type = "text"
                            placeholder= "Ingrese un nombre"
                            value = {accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                        />
                        
                        <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            >
                            <option value="">Tipo de moneda</option>

                            {currencies.map((cur) => (
                                <option key={cur.id_currency} value={cur.id_currency}>
                                {cur.iso}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            >
                            <option value="">Tipo de cuenta</option>

                            {types.map((typ) => (
                                <option key={typ.id_type} value={typ.id_type}>
                                {typ.name}
                                </option>
                            ))}
                        </select>

                        <Button
                            text = "Crear"
                            onClick={createAccount} 
                        />
                    </div>
                </div>
            )} 

            {showTransaction && (
                <div className="account"
                onClick={() => setShowTrans(false)}>
                    <div className="account-form"
                    onClick={(e) => e.stopPropagation()}>

                        <select onChange={(e) => setFromAccount(Number(e.target.value))}>
                            <option value="">Cuenta origen</option>
                            
                            {accounts
                            .filter(acc => acc.type_name !== "Gasto" && acc.type_name !== "Ingreso" && acc.type_name !== "Pasivo")
                            .map(acc => (
                                <option key={acc.id_account} value={acc.id_account}>
                                    {acc.account_name}
                                </option>
                            ))}
                        </select>

                        <select onChange={(e) => setToAccount(Number(e.target.value))}>
                            <option value="">Cuenta destino</option>
                            {accounts
                            .filter(acc => acc.id_account !== fromAccount && acc.type_name !== "Ingreso")
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


            {showIncome && (
                <div className="account"
                onClick={() => setShowIncome(false)}>
                    <div className="account-form"
                    onClick={(e) => e.stopPropagation()}>

                        <select onChange={(e) => setFromAccount(Number(e.target.value))}>
                            <option value="">Cuenta origen</option>
                            
                            {accounts
                            .filter(acc => acc.type_name !== "Gasto" && acc.type_name !== "Pasivo" && acc.type_name !== "Ingreso")
                            .map(acc => (
                                <option key={acc.id_account} value={acc.id_account}>
                                    {acc.account_name}
                                </option>
                            ))}
                        </select>

                        <select onChange={(e) => setToAccount(Number(e.target.value))}>
                            <option value="">Cuenta destino</option>
                            {accounts
                            .filter(acc => acc.type_name !== "Gasto" && acc.type_name !== "Pasivo" && acc.type_name !== "Activo")
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
                            onClick={income} 
                        />
                        
                    </div>
                </div>
            )}

        </div>
    );
    
}

export default Home;