import Button from "../Components/Button"; 
import Input from "../Components/Input"; 
import "./Login.css"
import { useState } from "react";


function Signup(){
    const [name, setName] = useState("");
    const [firstname, setFirstName] = useState("");
    const [secondname, setSecondName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);

    const validarUsuario = () => {

        if (name.length < 3) {
            setMensaje("Nombre debe de tener por lo menos 3 caracteres");
            return false;
        }

        if (firstname.length < 3) {
            setMensaje("Primer apellido debe de tener por lo menos 3 caracteres");
            return false;
        }

        if (secondname.length < 3) {
            setMensaje("Segundo apellido debe de tener por lo menos 3 caracteres");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setMensaje("Formato de email inválido");
            return false;
        }

        if (
            !email.endsWith("@gmail.com") &&
            !email.endsWith("@yahoo.com") &&
            !email.endsWith("@estudiantec.cr") &&
            !email.endsWith("@itcr.ac.cr") &&
            !email.endsWith("@hotmail.com")
        ) {
            setMensaje("El correo debe ser gmail, yahoo, etc");
            return false;
        }

        if (password.length < 8) {
            setMensaje("La contraseña debe tener al menos 8 caracteres");
            return false;
        }

        return true;
    };

    const handleSignup = async () => {

        if (!validarUsuario()) return;

        try {
            const res = await fetch("http://localhost:3227/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    last1: firstname,
                    last2: secondname,
                    email,
                    password
                })
            });

            const result = await res.text();

            if (res.ok) {
                setMostrarModal(true);
            } else {
                setMensaje(result);
            }

        } catch (error) {
            console.error(error);
            setMensaje("Error de conexión");
        }
    };

    return(
        <div className="page-body">
            <div className="form-container">
                <h1>Sign up</h1>

                {mostrarModal && (
                    <div className="modal">
                        <div className="modal-box">
                            <p>Usuario creado con éxito</p>
                            <Button
                            text="Continuar"
                            onClick={() => window.location.href = "/"}
                            />
                        </div>
                    </div>
                )}

                {mensaje && <p className="mensaje">{mensaje}</p>}

                <Input
                    label="Name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Input
                    label="First name"
                    type="text"
                    placeholder="Your first name"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <Input
                    label="Second name"
                    type="text"
                    placeholder="Your second name"
                    value={secondname}
                    onChange={(e) => setSecondName(e.target.value)}
                />

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
                    text="Sign up" 
                    onClick={handleSignup} 
                />

            </div>
        </div>
    );
}

export default Signup; 