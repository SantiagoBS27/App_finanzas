import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer">
      <Link className="footer-btn" to="/budget">Presupuestos</Link>
      <Link className="footer-btn" to="/exchange">Tipo de cambio</Link>
      <Link className="footer-btn" to="/transaction">Mover dinero</Link>
      <Link className="footer-btn" to="/subs">Suscripciones</Link>
    </div>
  );
}

export default Footer;