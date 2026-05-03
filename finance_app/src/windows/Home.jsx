import AccountCard from "../Components/AccountCard"; 
import CircularButton from "../Components/CircularButton"; 
import Button from "../Components/Button"; 
import Input from "../Components/Input"; 
import "./Home.css"; 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



function Home(){

    const [accounts, setAccounts] = useState([]);
    const [name, setName] = useState(""); 
    const [showForm, setShowForm] = useState(false);
    const [accountName, setAccountName] = useState("");
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [types, setTypes] = useState([])
    const [selectedType, setSelectedType] = useState("")
    const navigate = useNavigate();

    const createAccount = async () => {
        const userId = localStorage.getItem("userId");
        try{
            const res = await fetch("http://localhost:3227/createAccount", {
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

                
                const updated = await fetch(`http://localhost:3227/home?userId=${userId}`);
                const newAccounts = await updated.json();
                setAccounts(newAccounts);
            }else{
                alert(result); 
            }
        } catch(error){
            console.error(error);
        }

    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const savedName = localStorage.getItem("name"); 

        setName(savedName);

        fetch(`http://localhost:3227/home?userId=${userId}`)
            .then(res => res.json())
            .then(data => setAccounts(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetch("http://localhost:3227/currencies")
            .then(res => res.json())
            .then(data => setCurrencies(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetch("http://localhost:3227/types")
            .then(res => res.json())
            .then(data => setTypes(data))
            .catch(err => console.error(err));
    }, []);

    return(
        <>
        <button className="back-btn" onClick={() => navigate(-1)}>
        Volver
        </button>

        <div className="home-container">
            <h1> Bienvenido, {name} </h1>
            <h2> Cuentas </h2>

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
            )}; 

            <div className="accounts-container">
                {accounts.map((acc) => (
                    <AccountCard
                        key = {acc.id_account}
                        name = {acc.account_name}
                        balance = {acc.balance}
                        iso = {acc.iso}
                        onClick={() => navigate(`/account/${acc.id_account}`)}
                    />
                ))}
            </div >

            <Button
                text = "Crear una cuenta nueva"
                onClick={() => setShowForm(true)} 
            />
            

        </div>
        </>
    );
    
}

export default Home;