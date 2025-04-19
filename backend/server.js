require('dotenv').config();

const bcrypt = require('bcrypt');
const express = require('express');
const mysql = require('mysql2');
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT;


// Check if environment variables are loaded
// console.log("Database Host:", process.env.DB_HOST);
// console.log("Database User:", process.env.DB_USER);
// console.log("Database Name:", process.env.DB_NAME);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data


// MySQL Database Configuration
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Test the database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database.");
        connection.release(); // Release the connection back to the pool
    }
});



// Redirect the root path `/` to login.html 
app.get('/', (req, res) => {
  res.redirect('/login.html'); 
});

// Serve static files from the correct directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route to serve login.html
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// Route to serve index.html
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Route to serve signUp.html
app.get('/signUp.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'signUp.html'));
});


// Sign-up function
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
        return res.status(400).json({ message: "Missing userID, email or password", success: false });
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

    if (!userID || !toDo) {
        return res.status(400).json({ message: "Missing userID or todo", success: false });
    }

    const insertSQL = "INSERT INTO todo (userID, toDo, currStatus) VALUES (?, ?, 0)";
    
    console.log(`Executing Query: ${insertSQL} | Values: ${userID}, ${toDo}`);

    db.query(insertSQL, [userID, toDo], (err, result) => {
        if (err) {
            console.error("Error inserting todo:", err);
            return res.status(500).json({ message: 'Database error', success: false });
        } 

        console.log("Todo Added! Insert ID:", result.insertId);
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

// Create Event
app.post("/create_event", (req, res) => {
    const { userID, title, description, startTime, endTime, location, notes } =
      req.body;
    if (!userID || !title || !startTime)
      return res.status(400).json({ error: "Missing fields" });
  
    const sql =
      "INSERT INTO events (userID, title, description, startTime, endTime, location, notes) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [userID, title, description, startTime, endTime, location, notes],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Event created", event_id: result.insertId });
      }
    );
  });
  
  // Get Events
  app.get("/get-events/:userID", (req, res) => {
    const userID = req.params.userID;
    db.query(
      "SELECT * FROM events WHERE userID = ?",
      [userID],
      (err, results) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Database error", success: false });
        res.json(results);
      }
    );
  });


//Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});