import Button from "../Components/Button"; 
import Input from "../Components/Input"; 
import "./Login.css"; 
import { useState } from "react";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:3227/login", {
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

                alert("Login exitoso");
                window.location.href = "/home"
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
            <div className="form-container">
                <h1> Iniciar sesion </h1>

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
    );
}

export default Login; 