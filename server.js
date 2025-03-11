const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors({origin: 'http://127.0.0.1:5500'
})); 
app.use(express.json()); 

app.get("/api/message", (req, res) => {
    res.json({ message: "Hello from Node.js backend!" });
  });

app.get('/ics', async (req, res) => {
    try {
        const response = await axios.get('https://embark.mtholyoke.edu/ics?type=myevents&eid=688281eeb2387a8853d2c2acbcf9a91d');
        res.setHeader('Content-Type', 'text/calendar');
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});