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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setMensaje("Formato de correo invalido");
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
                <h1>Crear cuenta</h1>

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
                    label="Nombre"
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Input
                    label="Primer apellido"
                    type="text"
                    placeholder="Apellido"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <Input
                    label="Segundo apellido"
                    type="text"
                    placeholder="Apellido"
                    value={secondname}
                    onChange={(e) => setSecondName(e.target.value)}
                />

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
                    placeholder="Ingrese una contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /> 


                <Button 
                    text="Crear cuenta" 
                    onClick={handleSignup} 
                />

            </div>
        </div>
    );
}

export default Signup; 