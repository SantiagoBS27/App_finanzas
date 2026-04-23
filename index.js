const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const app = express();
const port = 3227
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "22:SJ-KEE.15$",   // tu contraseña de MySQL
    database: "app_finanzas"
});

app.use(express.json());

//Ruta principal 
app.use(express.static("public"));

// Levantar servidor
app.listen(port, () => {
  console.log("Servidor corriendo en http://localhost:"+port);
});

db.connect((err) => {
    if (err) {
        console.error("Error de conexión:", err);
    } else {
        console.log("Conectado a MySQL ✅");
    }
});

/*Logica del backend para el INSERT de los datos a la DB*/ 
app.post("/signup", (req, res) => {
    const { name, last1, last2, email, password } = req.body;

    const sqlINS = `
        INSERT INTO user 
        (name, last_name1, last_name2, email, password_hash1, password_hash2, created_at)
        VALUES (?, ?, ?, ?, ?, ?,  NOW())
    `;

    const sqlSER = `
        SELECT email
        FROM user 
        WHERE email = ? 
    `; 

    db.query(sqlSER, [email], (err, result) => {
        if(err){
            console.log(err);
            return res.send("Error en la verificación");
        }
        if(result.length > 0){
            return res.status(400).send("El correo ya está registrado"); 
        }
        bcrypt.hash(password, 10, (err, hash1) => {
            if(err){
                console.log(err);
                return res.status(500).send("Error al encriptar");
            }

            bcrypt.hash(hash1, 10, (err, hash2) => {
                if(err){
                    console.log(err);
                    return res.status(500).send("Error al encriptar");
                }
                db.query(sqlINS, [name, last1, last2, email, hash1, hash2], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.send("Error al registrar usuario");
                    } else {
                        res.send("Usuario creado correctamente");
                    }
                }); 
            }); 
        }); 
    }); 
});

/*Logica del backend para verificar que los datos sí están en la DB*/ 
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sqlLOG = `
        SELECT email, password_hash1, password_hash2
        FROM user 
        WHERE email = ? 
    `;

    db.query(sqlLOG, [email], (err, result) => {
        if (err){
            console.log(err); 
            return res.send("Error en la verificacion"); 
        }
        if (result.length == 0){
            return res.status(401).send("Usuario no encontrado");
        }

        const hash1 = result[0].password_hash1; 
        const hash2 = result[0].password_hash2; 

        bcrypt.compare(password, hash1, (err, match1) => {
            if (!match1){
                return res.status(401).send("Contraseña incorrecta");
            } 

            bcrypt.compare(hash1, hash2, (err, match2) => {
                if(match2){
                    return res.send("Login exitoso")
                } else {
                    return res.status(401).send("Error en segundo hash");
                }
            }); 
        }); 
    }); 
});



