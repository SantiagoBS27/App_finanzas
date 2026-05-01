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

            const result = await res.text();

            if (res.ok) {
                alert("Login exitoso");
                window.location.href = "/home"
            } else {
                alert(result);
            }

        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    return(
        <div className="page-body">
            <div className="form-container">
                <h1>Log in</h1>

                <Input
                    label="Email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                
                <Button 
                    text="Log in" 
                    onClick={handleLogin} 
                />

                <div class="signup">
                    Don't have an account?
                    <a href="/Signup">Create one!</a>
                </div>

            </div>
        </div>
    );
}

export default Login; 