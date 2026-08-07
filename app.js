const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const Post = require("./models/posts");
const Lost = require("./models/lost");
const Found = require("./models/found");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));

function authenticate(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
}

async function loadUser(req, res, next) {
  if (!req.userEmail) {
    return next();
  }

  try {
    const user = await User.findOne({ email: req.userEmail });
    req.user = user;
    res.locals.user = user;
    next();
  } catch (error) {
    console.error("User lookup failed:", error);
    next();
  }
}

app.get("/", async (req, res) => {
  res.render("index", { user: req.user || null, error: null, success: null });
});

app.get("/login", async (req, res) => {
  res.render("login", { error: null, success: null, user: req.user || null });
});

app.get("/signin", async (req, res) => {
  res.render("signin", { error: null, success: null, user: req.user || null });
});

app.post("/signin", async (req, res) => {
  const { username, email, password, age } = req.body;

  if (!username || !email || !password) {
    return res.render("signin", { error: "Please fill in all required fields.", success: null, user: null });
  }

  if (password.length < 6) {
    return res.render("signin", { error: "Password must be at least 6 characters long.", success: null, user: null });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signin", { error: "An account with this email already exists.", success: null, user: null });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      username,
      email,
      password: hash,
      age
    });

    const token = jwt.sign({ email: createdUser.email }, process.env.JWT_SECRET || "secret_key");
    res.cookie("token", token, { httpOnly: true });
    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).render("signin", { error: "Something went wrong while creating your account.", success: null, user: null });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login", { error: "Please enter both email and password.", success: null, user: null });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { error: "No account found with that email.", success: null, user: null });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password).catch(() => false);
    const isLegacyPasswordValid = user.password === password;

    if (isPasswordValid || isLegacyPasswordValid) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || "secret_key");
      res.cookie("token", token, { httpOnly: true });
      return res.redirect("/dashboard");
    }

    return res.render("login", { error: "Invalid email or password.", success: null, user: null });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).render("login", { error: "Something went wrong while logging in.", success: null, user: null });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

app.post("/confessions", authenticate, loadUser, async function (req, res) {
  const { title, content } = req.body;

  if (!title || !content) {
    const allconfessions = await Post.find({}).sort({ createdAt: -1 });
    return res.status(400).render("confessions", { allconfessions, error: "Please provide both a title and content.", success: null, user: req.user || null });
  }

  try {
    await Post.create({ title, content });
    const allconfessions = await Post.find({}).sort({ createdAt: -1 });
    return res.render("confessions", { allconfessions, error: null, success: "Confession posted successfully.", user: req.user || null });
  } catch (error) {
    console.error("Confession save failed:", error);
    const allconfessions = await Post.find({}).sort({ createdAt: -1 });
    return res.status(500).render("confessions", { allconfessions, error: "Your confession could not be saved right now.", success: null, user: req.user || null });
  }
});

app.get("/confessions", authenticate, loadUser, async function (req, res) {
  const allconfessions = await Post.find({}).sort({ createdAt: -1 });
  res.render("confessions", { allconfessions, error: null, success: null, user: req.user || null });
});

app.get("/dashboard", authenticate, loadUser, async (req, res) => {
  const [confessions, lostItems, totalUsers] = await Promise.all([
    Post.find({}).sort({ createdAt: -1 }).limit(3),
    Lost.find({}).sort({ date: -1 }).limit(3),
    User.countDocuments()
  ]);

  res.render("dashboard", {
    user: req.user,
    confessions,
    lostItems,
    stats: {
      confessions: await Post.countDocuments(),
      lostItems: await Lost.countDocuments(),
      users: totalUsers
    }
  });
});

app.get("/delete", async function (req, res) {
  let post = await Post.deleteMany({});
  res.send("Routes Deleted");
});

app.post("/lost", authenticate, loadUser, async function (req, res) {
  const { itemname, description, lost_location, date } = req.body;

  if (!itemname || !description || !lost_location) {
    const allitems = await Lost.find({}).sort({ date: -1 });
    return res.status(400).render("lost", { items: allitems, error: "Please provide item name, description, and location.", success: null, user: req.user || null });
  }

  try {
    await Lost.create({ itemname, description, lost_location, date: date || new Date() });
    const allitems = await Lost.find({}).sort({ date: -1 });
    return res.render("lost", { items: allitems, error: null, success: "Lost item report created successfully.", user: req.user || null });
  } catch (error) {
    console.error("Lost item save failed:", error);
    const allitems = await Lost.find({}).sort({ date: -1 });
    return res.status(500).render("lost", { items: allitems, error: "Your report could not be saved right now.", success: null, user: req.user || null });
  }
});

app.get("/lost", authenticate, loadUser, async function (req, res) {
  const allitems = await Lost.find({}).sort({ date: -1 });
  res.render("lost", { items: allitems, error: null, success: null, user: req.user || null });
});

app.get("/events", authenticate, loadUser, async function (req, res) {
  const events = [
    { title: "Byte Code Hackathon", date: "12 Jul 2026", location: "CSE Lab Block B", category: "Tech" },
    { title: "AI Seminar", date: "18 Jul 2026", location: "Main Auditorium", category: "Learning" },
    { title: "Campus Fest", date: "25 Jul 2026", location: "Open Ground", category: "Culture" }
  ];

  res.render("events", { events, user: req.user || null });
});

app.get("/profile", authenticate, loadUser, async function (req, res) {
  res.render("profile", { user: req.user, stats: { confessions: await Post.countDocuments({}), lostItems: await Lost.countDocuments({}) } });
});

app.get("/settings", authenticate, loadUser, async function (req, res) {
  res.render("settings", { user: req.user || null });
});

app.get("/404", (req, res) => {
  res.status(404).render("404", { user: req.user || null });
});

app.get("/found", async function (req, res) {
  let itemfound = await Found.create({
    itemname: "Wallet",
    description: "Black",
    found_location: "Library"
  });
  res.send(itemfound);
});

app.use((req, res) => {
  res.status(404).render("404", { user: null });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;