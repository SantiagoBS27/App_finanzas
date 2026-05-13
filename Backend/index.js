const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors"); 
const axios = require("axios");

const app = express();
const port = 3227

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "22:SJ-KEE.15$",   
    database: "app_finanzas"
});
const corsOptions = {
    origin: [
        "http://localhost:5173"
    ]
}

app.use(cors()); 
app.use(express.json()); 

app.get("/api", (req, res) =>{
    res.send("API funcionando");
}); 

app.listen(port, "0.0.0.0", () => {
  console.log("Servidor corriendo en http://localhost:"+port);
});

db.connect((err) => {
    if (err) {
        console.error("Error de conexión:", err);
    } else {
        console.log("Conectado a MySQL ✅");
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sqlLOG = `
        SELECT id_user, name, email, password_hash1, password_hash2
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
            if (err){
                console.log(err);
                return res.status(500).send("Error en bcrypt");
            }
            if (!match1){
                return res.status(401).send("Contraseña incorrecta");
            } 

            bcrypt.compare(hash1, hash2, (err, match2) => {
                if(match2){
                    return res.json({
                        message: "Login exitoso",
                        userId: result[0].id_user,
                        name: result[0].name
                    }); 
                } else {
                    return res.status(401).send("Error en segundo hash");
                }
            }); 
        }); 
    }); 
});

app.post("/signup", (req, res) => {
    const { name, last1, last2, email, password } = req.body;

    if (!name || !last1 || !last2 || !email || !password) {
        return res.status(400).send("Faltan datos");
    }

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
            return res.status(500).send("Error en la verificación");
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
                        return res.status(500).send("Error al registrar usuario");
                    } else {
                        const userId = result.insertId; 
                        const defaultAccounts = [
                            { name: "Trabajo", type: 1 },
                            { name: "Salario", type: 2 },
                            { name: "Comida", type: 3 },
                            { name: "Ahorros", type: 1 },
                            { name: "Tarjeta Crédito", type: 5 }
                        ];
                        defaultAccounts.forEach(acc => {
                            const sql = `
                                INSERT INTO account 
                                (id_user, id_currency, id_type, account_name, created_at)
                                VALUES(?, ?, ?, ?, NOW())
                            `;
                            db.query(sql, [userId, 1, acc.type, acc.name], (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                            }); 
                        }); 
                        res.send("Usuario creado correctamente");
                    }
                }); 
            }); 
        }); 
    }); 
});

app.get("/home", (req, res) => {

    const userId = req.query.userId;

    const sqlAcc = `
        SELECT 
            a.account_name, 
            a.balance, 
            a.id_account, 
            c.iso,
            t.name AS type_name
        FROM account a
        JOIN currencyType c ON c.id_currency = a.id_currency
        JOIN accounttype t ON t.id_type = a.id_type
        WHERE a.id_user = ?  
        AND a.deactivated_at IS NULL
    `

    db.query(sqlAcc, [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error");
        }

        res.json(result);
    }); 

});

app.get("/types", (req, res) => {
    const sql = "SELECT id_type, name FROM accounttype";

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error");
        }

        res.json(result);
    });
});

app.get("/currencies", (req, res) => {
    const sql = "SELECT id_currency, iso FROM currencyType";

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error");
        }

        res.json(result);
    });
});

app.get("/exchange-rate", async (req, res) => {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
        return res.status(400).json({ message: "Faltan datos" });
    }

    try {
        const url = `https://api.frankfurter.app/${date}?from=${from}&to=${to}`;
        const response = await axios.get(url);

        const rate = response.data.rates[to];

        if (!rate) {
            return res.status(404).json({ message: "No hay tasa disponible" });
        }

        res.json({
            from,
            to,
            date: response.data.date,
            rate
        });

    } catch (error) {
        console.log(error.response?.data || error.message);
        res.status(500).json({ message: "Error obteniendo tasa de cambio" });
    }
});


app.get("/account/:id", (req, res) => {
    const accountId = req.params.id;

    const sql = `
        SELECT a.id_account, a.id_type, a.account_name, a.balance, a.created_at,
               c.iso, b.amount AS budget, b.start_date AS start, b.end_date AS end,  
               t.name AS type_name
        FROM account a
        JOIN currencyType c ON c.id_currency = a.id_currency
        JOIN accounttype t ON t.id_type = a.id_type
        LEFT JOIN budget b 
            ON b.id_account = a.id_account
            AND b.end_date = (
                SELECT MAX(end_date)
                FROM budget
                WHERE id_account = a.id_account
            )
        WHERE a.id_account = ?
    `;

    db.query(sql, [accountId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error");
        }

        if (result.length === 0) {
            return res.status(404).send("Cuenta no encontrada");
        }

        res.json(result[0]);
    });
});

app.post("/createBudget", (req, res) => {

    const { accountId, amount, days } = req.body;

    db.beginTransaction((err) => {

        if (err) {
            return res.status(500).send("Error");
        }

        const resetBalance = `
            UPDATE account
            SET balance = 0
            WHERE id_account = ?
        `;

        db.query(resetBalance, [accountId], (err) => {

            if (err) {
                return db.rollback(() => {
                    console.error(err);
                    res.status(500).send("Error reseteando balance");
                });
            }

            const sql = `
                INSERT INTO budget
                (id_account, amount, start_date, end_date)
                VALUES
                (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))
            `;

            db.query(sql, [accountId, amount, days], (err) => {

                if (err) {
                    return db.rollback(() => {
                        console.error(err);
                        res.status(500).send("Error al crear presupuesto");
                    });
                }

                db.commit((err) => {

                    if (err) {
                        return db.rollback(() => {
                            console.error(err);
                            res.status(500).send("Error commit");
                        });
                    }

                    res.json({
                        message: "Budget creado correctamente"
                    });
                });
            });
        });
    });
});

app.post("/createAccount", (req, res) => {
    const {userId, currencyId, typeId, accountName} = req.body; 
        
    if (!userId || !currencyId || !typeId || !accountName) {
    return res.status(400).send("Faltan datos");
    }

    const sqlCre = `
        INSERT INTO account
        (id_user, id_currency, id_type, account_name, created_at)
        VALUES(?, ?, ?, ?, NOW())
    `;

    db.query(sqlCre,[userId, currencyId, typeId, accountName], (err,result) =>{
        if (err) {
            console.log(err);
            return res.status(500).send("Error");
        }

        res.send("Cuenta creada correctamente") 
    });
}); 

app.get("/historyBudget/:id", (req, res) => {
    const accountId = req.params.id;

    const sqlBH = `
        SELECT amount, start_date, end_date
        FROM budget b
        WHERE id_account = ?
        ORDER BY start_date DESC
    `; 

    db.query(sqlBH, [accountId], (err, result) => {
        if(err){
            console.log(err); 
            return res.status(500).send("Error"); 
        }

        res.json(result); 
    }); 
}); 

app.get("/budgets/:userId", (req, res) => {
    const userId = req.params.userId; 

    const sqlALLB = `
        SELECT amount, start_date, end_date,
            a.account_name, a.id_account
        FROM budget b 
        JOIN account a ON a.id_account = b.id_account 
        WHERE a.id_user = ?
        ORDER BY b.start_date DESC
    `;

    db.query(sqlALLB, [userId], (err, result) => {
        if (err){
            console.log(err); 
            return res.status(500).send("Error"); 
        } 

        res.json(result); 
    });
}); 

app.get("/transactions/:userId", (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT 
            t.amount,
            t.date,
            a1.account_name AS from_account,
            a2.account_name AS to_account
        FROM \`transaction\` t
        JOIN account a1 ON a1.id_account = t.id_orig_account
        JOIN account a2 ON a2.id_account = t.id_dest_account
        WHERE a1.id_user = ? OR a2.id_user = ?
        ORDER BY t.date DESC
    `;

    db.query(sql, [userId, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error");
        }
        res.json(result);
    });
});

app.post("/transaction", (req, res) => {
    const { fromAccId, toAccId, amount } = req.body;

    if (Number(fromAccId) === Number(toAccId)) {
        return res.status(400).send("No puedes transferir a la misma cuenta");
    }

    const currencySql = `
    SELECT id_currency
    FROM account
    WHERE id_account IN (?, ?)
    `;

    db.query(currencySql, [fromAccId, toAccId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error");
        }

        if (result.length < 2) {
            return res.status(400).send("Cuenta inválida");
        }

        if (result[0].id_currency !== result[1].id_currency) {
            return res
                .status(400)
                .send("Las cuentas deben tener la misma moneda");
        }

        db.beginTransaction((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error");
            }
 
            const updateFrom = `
                UPDATE account
                SET balance = balance - ?
                WHERE id_account = ? AND balance >= ?
            `;

            db.query(updateFrom, [amount, fromAccId, amount], (err, result) => {
                if (err) {
                    return db.rollback(() => res.status(500).send("Error origen"));
                }

                if (result.affectedRows === 0) {
                    return db.rollback(() => res.status(400).send("Fondos insuficientes"));
                }

                const updateTo = `
                    UPDATE account
                    SET balance = balance + ?
                    WHERE id_account = ?
                `;

                db.query(updateTo, [amount, toAccId], (err) => {
                    if (err) {
                        return db.rollback(() => res.status(500).send("Error destino"));
                    }

                    const insertSql = `
                        INSERT INTO \`transaction\`
                        (id_orig_account, id_dest_account, amount, date)
                        VALUES (?, ?, ?, NOW())
                    `;

                    db.query(insertSql, [fromAccId, toAccId, amount], (err) => {
                        if (err) {
                            return db.rollback(() => res.status(500).send("Error en transacción"));
                        }

                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => res.status(500).send("Error commit"));
                            }

                            res.send("Transacción exitosa");
                        });
                    });
                });
            });
        });
    }); 
});

app.post("/income", (req, res) => {
    const {fromAccount, toAccId, amount} = req.body;

    if (Number(fromAccount) === Number(toAccId)) {
        return res.status(400).send("No puedes transferir a la misma cuenta");
    }

    if (!toAccId || amount <= 0) {
        return res.status(400).send("Datos inválidos");
    }

    const currencySql = `
    SELECT id_account, id_currency, id_type
    FROM account
    WHERE id_account IN (?, ?)
    `;

    db.query(currencySql, [fromAccount, toAccId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error");
        }

        if (result.length < 2) {
            return res.status(400).send("Cuenta inválida");
        }

        if (result[0].id_currency !== result[1].id_currency) {
            return res
                .status(400)
                .send("Las cuentas deben tener la misma moneda");
        }

        let finalAmount = Number(amount);

        const fromData = result.find(
            acc => acc.id_account == fromAccount
        );

        if(fromData.id_type === 5){
            finalAmount = -Number(amount);
        }

        db.beginTransaction((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error");
            }

            const updateFrom = `
                UPDATE account
                SET balance = balance + ?
                WHERE id_account = ?
            `;

            db.query(updateFrom, [finalAmount, fromAccount], (err) => {
                if (err) {
                    console.error(err);
                    return db.rollback(() => res.status(500).send("Error origen"));
                }

                const updateTo = `
                    UPDATE account
                    SET balance = balance + ?
                    WHERE id_account = ?
                `;

                db.query(updateTo, [Math.abs(amount), toAccId], (err) => {
                    if (err) {
                        console.error(err);
                        return db.rollback(() => res.status(500).send("Error destino"));
                    }

                    const insertSql = `
                        INSERT INTO \`transaction\`
                        (id_orig_account, id_dest_account, amount, date)
                        VALUES (?, ?, ?, NOW())
                    `;

                    db.query(insertSql, [fromAccount, toAccId, amount], (err) => {
                        if (err) {
                            console.error(err);
                            return db.rollback(() => res.status(500).send("Error en transacción"));
                        }

                        db.commit((err) => {
                            if (err) {
                                console.error(err);
                                return db.rollback(() => res.status(500).send("Error commit"));
                            }

                            res.send("Registro de ingreso exitoso");
                        });
                    });
                });
            }); 
        });
    });
}); 

app.put("/deactivateAccount/:id", (req, res) => {

    const accountId = req.params.id;

    const sql = `
        UPDATE account
        SET deactivated_at = NOW()
        WHERE id_account = ?
    `;

    db.query(sql, [accountId], (err, result) => {

        if(err){
            console.log(err);
            return res.status(500).send("Error");
        }

        res.send("Cuenta desactivada");
    });
});

app.post("/adjust", (req, res) => {
    const {accountId, amount} = req.body;

    const sql = `
        UPDATE account
        SET balance = ?
        WHERE id_account = ?
    `;

    const finalAmount = -Math.abs(amount); 

    db.query(sql, [finalAmount, accountId], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).send("Error");
        }

        res.send("Monto ajustado");
    });
}); 