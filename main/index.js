const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const session = require("express-session");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "frontend")));

// Set up Sequelize with MySQL
const sequelize = new Sequelize("yumshare", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

// Define User model to match admin_login table schema
const User = sequelize.define("admin_login", {
  email: { type: DataTypes.STRING(50), allowNull: false },
  username: { type: DataTypes.STRING(50), primaryKey: true, allowNull: false },
  password: { type: DataTypes.STRING(40), allowNull: false },
  fname: { type: DataTypes.STRING(50), allowNull: false },
  lname: { type: DataTypes.STRING(50), allowNull: false },
});

// Define Recipe model
const Recipe = sequelize.define("recipe", {
  title: { type: DataTypes.STRING(100), allowNull: false },
  ingredients: { type: DataTypes.TEXT, allowNull: false },
  instructions: { type: DataTypes.TEXT, allowNull: false },
  cuisine: { type: DataTypes.STRING(50), allowNull: false },
  cookingt: { type: DataTypes.INTEGER, allowNull: false },
  serving: { type: DataTypes.INTEGER, allowNull: false },
  author: { type: DataTypes.STRING(50), allowNull: false },
});

// Sync the database
sequelize.sync();

// Use session to keep track of logged in users
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Sign-up route
app.post("/signup", async (req, res) => {
  const { email, username, password, "first-name": fname, "last-name": lname } = req.body;

  if (!email || !username || !password || !fname || !lname) {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await User.create({ email, username, password, fname, lname });
    res.redirect("/homepage.html");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (user && user.password === password) {
      req.session.userId = user.username;
      res.redirect("/addrecipe.html");
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
});

// Add recipe route
app.post("/addrecipe", async (req, res) => {
  const { title, ingredients, instructions, cuisine, cookingt, serving, author } = req.body;

  try {
    await Recipe.create({
      title,
      ingredients,
      instructions,
      cuisine,
      cookingt,
      serving,
      author,
    });
    res.redirect("/homepage.html");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding recipe");
  }
});

// Serve the homepage and fetch recipes
app.get("/homepage.html", async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    const recipesHTML = recipes
      .map(
        (recipe) => `
      <div class="recipe-card">
        <h2>${recipe.title}</h2>
        <p>${recipe.ingredients}</p>
        <a href="#">View recipe</a>
      </div>
    `
      )
      .join("");
    const homepagePath = path.join(__dirname, "frontend", "homepage.html");
    const homepageHTML = await fs.promises.readFile(homepagePath, "utf8");
    const updatedHTML = homepageHTML.replace(
      "<!-- Recipe Cards Placeholder -->",
      recipesHTML
    );
    res.send(updatedHTML);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching recipes");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "authpage.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
