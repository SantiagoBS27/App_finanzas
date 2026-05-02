import AccountCard from "../Components/AccountCard"; 
import Footer from "../Components/Footer"; 
import CircularButton from "../Components/CircularButton"; 
import Button from "../Components/Button"; 
import Input from "../Components/Input"; 
import "./Home.css"; 
import { useEffect, useState } from "react";



function Home(){

    const [accounts, setAccounts] = useState([]);
    const [name, setName] = useState(""); 
    const [showForm, setShowForm] = useState(false);
    const [accountName, setAccountName] = useState("");
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [types, setTypes] = useState([])
    const [selectedType, setSelectedType] = useState("")

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
        <div className="home-container">
            <h1>Welcome {name}!!</h1>
            <h2>Your accounts</h2>

            {showForm && (
                <div className="account" 
                onClick={() => setShowForm(false)}>
                    <div className="account-form"
                    onClick={(e) => e.stopPropagation()}>
                        <Input
                            label = "Account name"
                            type = "text"
                            placeholder= "Enter a name for your account"
                            value = {accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                        />
                        
                        <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            >
                            <option value="">Select currency</option>

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
                            <option value="">Select account type</option>

                            {types.map((typ) => (
                                <option key={typ.id_type} value={typ.id_type}>
                                {typ.name}
                                </option>
                            ))}
                        </select>

                        <Button
                            text = "Create"
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
                        onClick = {() => console.log(acc.id_account)} //abrirCuenta(acc.id)}
                    />
                ))}
            </div >

            <Button
                text = "+"
                onClick={() => setShowForm(true)} 
            />

            <div className="buttons-row">
                <CircularButton
                    text="Income" 
                    
                />

                <CircularButton
                    text="Transaction" 
                    
                />

                <CircularButton
                    text="Expense" 
                    
                />
            
            </div>

            <Footer/>
            

        </div>
    );
}

export default Home;