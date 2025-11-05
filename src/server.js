const express = require('express');
const app = express();
const cors = require("cors");
const connectDB = require('./dbconnect/db');
const userRoute = require('./routes/user.routes')

const DATABASE_URL = 'mongodb://localhost:27017/UserManagementDB';

connectDB(DATABASE_URL);

app.use(cors());
app.use(express.json()); // Parses incoming requests with JSON payloads.
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use('/api/users',userRoute);
