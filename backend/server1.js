require('dotenv').config();

const bcrypt = require('bcrypt');
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 3006;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

// MySQL Database Configuration
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
  });

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Basic route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Route to serve login.html
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

// Route to serve signUp.html
app.get('/signUp.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'signUp.html'));
});


// Dummy in-memory "database" of users
let users = [];

// Sign-up function
app.post('/signup', (req, res) => {
    const { userID, userEmail, password, confirmPassword } = req.body;

    if (!userID || !userEmail || !password || !confirmPassword) {
        return res.status(400).json({ message: "Missing email or password fields", success: false });
    }
    
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match", success: false });
    }

    // Check if the email already exists
    const checkEmailSQL = "SELECT * FROM users WHERE userEmail = ?";
    db.query(checkEmailSQL, [userEmail], (err, results) => {
        if (err) {
            console.error("Database error on checking email:", err);
            return res.status(500).json({ message: "Database error", success: false });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ message: "Email already exists", success: false });
        }

        // Check if the userID already exists
        const checkUserSQL = "SELECT * FROM users WHERE userID = ?";
    db.query(checkUserSQL, [userID], (err, results) => {
        if (err) {
                console.error("Database error on checking userID:", err);
                return res.status(500).json({ message: "Database error", success: false });
        }
            
        if (results.length > 0) {
                return res.status(400).json({ message: "UserID already exists", success: false });
        }

            // Insert new user (hash the password in production!)
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) return res.status(500).json({ message: "Error hashing password", success: false });
            
                const insertSQL = "INSERT INTO users (userID, userEmail, password) VALUES (?, ?, ?)";
                db.query(insertSQL, [userID, userEmail, hash], (err, result) => {
                    if (err) {
                        console.error("Error inserting user:", err);
                        return res.status(500).json({ message: "Database error", success: false });
                    }
                    res.status(200).json({ message: "Sign-up successful", success: true });
                });
            })
        });
    });
});



// Login function

app.post('/login', (req, res) => {
    const { userID, userEmail, password } = req.body;

    if (!userID || !userEmail || !password) {
        return res.status(400).json({ message: "Missing email or password", success: false });
    }

    const sql = "SELECT * FROM users WHERE userID = ? AND userEmail = ?";
    db.query(sql, [userID, userEmail], (err, results) => {
        if (err) {
            console.error("Database error on login:", err);
            return res.status(500).json({ message: "Database error", success: false });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials", success: false });
        }

        // Compare the entered password with the hashed password stored in the database
        const storedHashedPassword = results[0].password;
        bcrypt.compare(password, storedHashedPassword, (err, isMatch) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).json({ message: "Error checking password", success: false });
            }

            if (isMatch) {
                return res.status(200).json({ 
                    message: "Login successful", 
                    userID: results[0].userID,
                    success: true 
                });
            } else {
                return res.status(401).json({ message: "Invalid credentials", success: false });
            }
        });
    });
});



// **Add a Todo (Default `currStatus = 0` for Incomplete)**
app.post('/add-todo', (req, res) => {
    const { userID, toDo } = req.body;

    console.log("Received data:", req.body); // ✅ Debugging log

    if (!userID || !toDo) {
        return res.status(400).json({ message: "Missing userID or todo", success: false });
    }

    const insertSQL = "INSERT INTO todo (userID, toDo, currStatus) VALUES (?, ?, 0)";
    db.query(insertSQL, [userID, toDo], (err, result) => {
        if (err) {
            console.error("Error inserting todo:", err);
            return res.status(500).json({ message: 'Database error', success: false });
        }

        res.json({ message: 'Todo added successfully.', id: result.insertId, success: true });
    });
});


// Mark Todo as Completed (`currStatus = 1`)
app.put('/complete-todo/:id', (req, res) => {
    const todoID = req.params.id;

    console.log(`Updating todo ID: ${todoID}`); 
    const sql = 'UPDATE todo SET currStatus = 1 WHERE id = ?';

    db.query(sql, [todoID], (err, result) => {
        if (err) {
            console.error("Error updating todo:", err);
            res.status(500).json({ message: 'Database error', success: false });
            return;
        }

        console.log("Update result:", result);

        if (result.affectedRows > 0) {
            res.json({ message: 'Todo marked as completed!', success: true });
        } else {
            res.json({ message: 'Todo not found', success: false });
        }
    });
});




// **Fetch Todos for a Specific User**
app.get('/get-todos/:userID', (req, res) => {
    const userID = req.params.userID;

    if (!userID) {
        return res.status(400).json({ message: "Missing userID", success: false });
    }

    const sql = "SELECT * FROM todo WHERE userID = ?";
    db.query(sql, [userID], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", success: false });
        }
        res.json(result);
    });
});

// not sure about this
app.get('/get-events/:userID', (req, res) => {
    const userID = req.params.userID;

    const sql = "SELECT * FROM events WHERE userID = ?";
    db.query(sql, [userID], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", success: false });
        }
        res.json(results);
    });
});


//Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});