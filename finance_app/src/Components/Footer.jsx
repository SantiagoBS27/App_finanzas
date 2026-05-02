import { Link } from "react-router-dom";
import "./Footer.css";

function Footer(){
    return (
        <div className="footer">
            <Link to="/budget">Budgets</Link>
            <Link to="/exchange">Exchange rate</Link>
            <Link to="/subs">Subscriptions</Link>
        </div>
    );
}

export default Footer;