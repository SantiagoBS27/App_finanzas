import Button from "../Components/Button"; 
import Input from "../Components/Input"; 
import "./Login.css"; 
import { useState } from "react";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);

    const handleLogin = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("name", data.name); 

                setMostrarModal(true);
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    return(
        <div className="page-body">
            <div className="login-wrapper">
                <div className="left-side">
                    <img src="/images/cerdi.ico" alt="Logo" />

                    <h1 className="brand-title">
                        Fluj<span>ex</span>
                    </h1>

                </div>

                <div className="form-container">
                    <h1> Bienvenido de vuelta </h1>

                    {mostrarModal && (
                        <div className="modal">
                            <div className="modal-box">
                                <p>Usuario validado con éxito</p>
                                <Button
                                text="Continuar"
                                onClick={() => window.location.href = "/home"}
                                />
                            </div>
                        </div>
                    )}

                    <Input
                        label="Correo"
                        type="email"
                        placeholder="ejemplo@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    <Button 
                        text="Ingresar" 
                        onClick={handleLogin} 
                    />

                    <div class="signup">
                        ¿No tiene una cuenta?
                        <a href="/Signup"> Crear una cuenta. </a>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login; 