import AccountCard from "../Components/AccountCard"; 
import Footer from "../Components/Footer"; 
import CircularButton from "../Components/CircularButton"; 
import "./Home.css"; 
import { useEffect, useState } from "react";



function Home({name}){

    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3227/accounts")
            .then(res => res.json())
            .then(data => setAccounts(data))
            .catch(err => console.error(err));
    }, []);

    return(
        <div className="home-container">
            <h1>Welcome {name}!!</h1>
            <h2>Your accounts</h2>

            <div className="accounts-container">
                {accounts.map((acc) => (
                    <AccountCard
                        key = {acc.id}
                        name = {acc.name}
                        balance = {acc.balance}
                        iso = {acc.iso}
                        onClick = {() => console.log(acc.id)} //abrirCuenta(acc.id)}
                    />
                ))}
            </div >

            <CircularButton
                text="Income" 
            />

            <Footer/>


        </div>
    );
}

export default Home;