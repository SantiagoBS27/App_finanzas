document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnLogin");

    if(btn){
        btn.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});

function mostrarMensaje(text, tipo){
    const mensaje = document.getElementById("mensaje"); 
    mensaje.innerText = text; 
    if(tipo === "error"){ 
        mensaje.style.color = "red";
    } else if(tipo === "success"){
        mensaje.style.color = "green";
    }
}

function validarUsuario(){
    let nombre = document.getElementById("name").value;
    let apellido1 = document.getElementById("last_name1").value;
    let apellido2 = document.getElementById("last_name2").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    if(nombre.length < 3){
        mostrarMensaje("Name must be at least 3 characters", "error"); 
        return false; 
    }
    if(apellido1.length < 3){
        mostrarMensaje("First last name must be at least 3 characters", "error");
        return false; 
    }
    if(apellido2.length < 3){
        mostrarMensaje("Second last name must be at least 3 characters", "error"); 
        return false; 
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        mostrarMensaje("Invalid email format", "error"); 
        return false; 
    }
    if(
    !email.endsWith("@gmail.com") &&
    !email.endsWith("@yahoo.com") &&
    !email.endsWith("@estudiantec.cr") &&
    !email.endsWith("@itcr.ac.cr") &&
    !email.endsWith("@hotmail.com")
    ){
    mostrarMensaje("Email must be a valid email, example: gmail, yahoo, hotmail", "error");
    return false;
    }
    if(password.length < 8){
    mostrarMensaje("Password must be at least 8 characters", "error"); 
    return false; 
    }

    return true; 
}

/*Este es el fetch el cuál se encarga de recibir los datos del signup y enviarlos al backend*/
if(window.location.pathname.includes("signin")){
    document.querySelector("form").addEventListener("submit", async (e) => {
        e.preventDefault();

        if(!validarUsuario()){
            return;
        }
        const data = {
            name: document.getElementById("name").value,
            last1: document.getElementById("last_name1").value,
            last2: document.getElementById("last_name2").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        const res = await fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.text();
        if(res.ok){
            document.getElementById("modal").classList.add("active");
        } else {
            alert(result);
        }
        
        
    });
}


/*Este es el fetch el cuál se encarga de recibir los datos del login y enviarlos al backend*/
if(window.location.pathname.includes("index")){
    document.querySelector("form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        const res = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.text();
        if(res.ok){
            window.location.href = "home.html";
        } else {
            alert(result);
        }
        
});
}