import "./AccountCard.css"; 

function AccountCard({name, balance, iso, onClick}){
    return(
        <div className="AccCard" onClick={onClick}>
            <h3>{name}</h3>
            <p>{balance.toLocaleString()} {iso}</p>
        </div>
    );
}

export default AccountCard; 