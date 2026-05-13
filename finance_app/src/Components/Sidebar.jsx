import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar({
    showSidebar,
    setShowSidebar,
    setActiveSection,
    setShowForm,
    setShowTrans,
    setFromAccount,
    setAmount,
    setShowIncome,
    fetchBudgets,
    fetchTransactions
}) {

    return(
        <div className={`sidebar ${showSidebar ? "open" : ""}`}>

            <div className="sidebar-content">
                <button
                    className="close-sidebar"
                    onClick={() => setShowSidebar(false)}
                >
                    ✕
                </button>

                <h1 className="logo">
                    Fluj<span>ex</span>
                </h1>

                <button
                    className="sidebar-btn"
                    onClick={() => {
                        setActiveSection("accounts")
                        setShowSidebar(false);
                    }}
                >
                    Cuentas
                </button>

                <button
                    className="sidebar-btn"
                    onClick={() => {
                        setShowTrans(true);
                        setShowSidebar(false);
                        setFromAccount(""); 
                        setAmount(""); 
                    }}
                >
                    Transacción
                </button>

                <button
                    className="sidebar-btn"
                    onClick={() => {
                        setShowIncome(true);
                        setShowSidebar(false);
                    }}
                >
                    Registrar ingreso
                </button>

                <button
                    className="sidebar-btn"
                    onClick={() => {
                        setActiveSection("history"); 
                        fetchTransactions();
                        setShowSidebar(false);
                    }}
                >
                    Transacciones
                </button>

                <button
                    className="sidebar-btn"
                    onClick={() => {
                        setActiveSection("budgets"); 
                        fetchBudgets();
                        setShowSidebar(false);
                    }}
                >
                    Presupuestos
                </button>

                <button
                    className="sidebar-btn"
                    onClick={() => {
                        setShowForm(true);
                        setShowSidebar(false);
                    }}
                    
                >
                    Nueva cuenta
                </button>

                <Link
                    to="/exchange"
                    className="sidebar-btn link-btn"
                >
                    Exchange Rate
                </Link>

            </div>

        </div>
    );
}

export default Sidebar;