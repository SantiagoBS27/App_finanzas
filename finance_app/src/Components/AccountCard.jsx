import "./AccountCard.css"; 

function AccountCard({name, balance, iso, type, onClick}){
    return(
        <div className={`AccCard ${type}`} onClick={onClick}>
            <h3>{name}</h3>
            <p>{balance.toLocaleString()} {iso}</p>
        </div>
    );
}

export default AccountCard; 