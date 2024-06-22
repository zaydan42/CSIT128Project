const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend')));

// Set up Sequelize with MySQL
const sequelize = new Sequelize('yumshare', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define User model to match admin_login table schema
const User = sequelize.define('admin_login', {
  email: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  fname: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  lname: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
});

// Sync the database
sequelize.sync();

// Sign-up route
app.post('/signup', async (req, res) => {
  const { email, username, password, 'first-name': fname, 'last-name': lname } = req.body;

  if (!email || !username || !password || !fname || !lname) {
    return res.status(400).send('All fields are required');
  }

  try {
    // Create the new user without hashing the password
    const user = await User.create({
      email,
      username,
      password,
      fname,
      lname
    });

    res.status(201).send('User created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user');
  }
});

// Serve the signup page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signuppage.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
