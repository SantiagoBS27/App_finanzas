import { Link } from "react-router-dom";
import "./Footer.css";

function Footer({ onOpenBudgets }) {
  return (
    <div className="footer">
      <Link className="footer-btn" onClick={onOpenBudgets}>
        Presupuestos
      </Link>
      <Link to="/exchange" className="footer-btn">Tipo de cambio</Link>
    </div>
  );
}

export default Footer;