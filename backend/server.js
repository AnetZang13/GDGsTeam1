require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

// MySQL DB connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database.");
    connection.release();
  }
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Serve HTML
app.get("/", (req, res) => res.redirect("/login.html"));
app.get("/login.html", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "public", "login.html"))
);
app.get("/signUp.html", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "public", "signUp.html"))
);
app.get("/index.html", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "public", "index.html"))
);

// Sign-up
app.post("/signup", (req, res) => {
  const { userID, userEmail, password, confirmPassword } = req.body;

  if (!userID || !userEmail || !password || !confirmPassword) {
    return res.status(400).json({ message: "Missing fields", success: false });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Passwords do not match", success: false });
  }

  // Check for duplicates
  const checkEmailSQL = "SELECT * FROM users WHERE userEmail = ?";
  db.query(checkEmailSQL, [userEmail], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Database error", success: false });
    if (results.length > 0)
      return res.status(400).json({ message: "Email exists", success: false });

    const checkUserSQL = "SELECT * FROM users WHERE userID = ?";
    db.query(checkUserSQL, [userID], (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Database error", success: false });
      if (results.length > 0)
        return res
          .status(400)
          .json({ message: "UserID exists", success: false });

      bcrypt.hash(password, 10, (err, hash) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Error hashing", success: false });

        const insertSQL =
          "INSERT INTO users (userID, userEmail, password) VALUES (?, ?, ?)";
        db.query(insertSQL, [userID, userEmail, hash], (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Database error", success: false });

          // Send confirmation email
          const mailOptions = {
            from: "your-email@gmail.com",
            to: userEmail,
            subject: "Welcome to the Platform!",
            text: `Hi ${userID},\n\nThank you for signing up!\n\nBest,\nTeam`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Email error:", error);
              return res.status(500).json({
                message: "Sign-up done, but failed to send email",
                success: true,
              });
            }
            res.status(200).json({
              message: "Sign-up successful! Email sent.",
              success: true,
            });
          });
        });
      });
    });
  });
});

// Login
app.post("/login", (req, res) => {
  const { userID, userEmail, password } = req.body;

  if (!userID || !userEmail || !password) {
    return res
      .status(400)
      .json({ message: "Missing login fields", success: false });
  }

  const sql = "SELECT * FROM users WHERE userID = ? AND userEmail = ?";
  db.query(sql, [userID, userEmail], (err, results) => {
    if (err)
      return res.status(500).json({ message: "DB error", success: false });
    if (results.length === 0)
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });

    const storedHash = results[0].password;
    bcrypt.compare(password, storedHash, (err, isMatch) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Hash compare error", success: false });
      if (isMatch) {
        res.status(200).json({
          message: "Login successful",
          userID: results[0].userID,
          success: true,
        });
      } else {
        res.status(401).json({ message: "Wrong password", success: false });
      }
    });
  });
});

// Add Todo
app.post("/add-todo", (req, res) => {
  const { userID, toDo } = req.body;

  if (!userID || !toDo)
    return res
      .status(400)
      .json({ message: "Missing todo or userID", success: false });

  const insertSQL =
    "INSERT INTO todo (userID, toDo, currStatus) VALUES (?, ?, 0)";
  db.query(insertSQL, [userID, toDo], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Database error", success: false });
    res.json({ message: "Todo added", id: result.insertId, success: true });
  });
});

// Get Todos
app.get("/get-todos/:userID", (req, res) => {
  const userID = req.params.userID;
  db.query("SELECT * FROM todo WHERE userID = ?", [userID], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Database error", success: false });
    res.json(results);
  });
});

// Mark Todo Complete
app.put("/complete-todo/:id", (req, res) => {
  const todoID = req.params.id;
  db.query(
    "UPDATE todo SET currStatus = 1 WHERE id = ?",
    [todoID],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Database error", success: false });
      res.json({ message: "Todo completed", success: true });
    }
  );
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

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
