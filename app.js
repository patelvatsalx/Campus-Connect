const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const mongoose = require('mongoose');
const Post = require("./models/posts");
const Lost = require("./models/lost")
const Found = require("./models/found")

const app = express();
const PORT = 3000;

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.use(express.static(__dirname));


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/signin", function(req, res){
    res.render("signin");
});

app.post("/signin", async (req, res) => {
    const { username, email, password, age } = req.body;

    if (!username || !email || !password) {
        return res.render("signin", { error: "Please fill all required fields." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("signin", { error: "An account with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const createdUser = await User.create({
            username,
            email,
            password: hash,
            age
        });

        const token = jwt.sign({ email: createdUser.email }, "secret_key");
        res.cookie("token", token);
        return res.redirect("/dashboard");
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).render("signin", { error: "Something went wrong while creating your account." });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render("login", { error: "Please enter both email and password." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render("login", { error: "No account found with that email." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password).catch(() => false);
        const isLegacyPasswordValid = user.password === password;

        if (isPasswordValid || isLegacyPasswordValid) {
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || "secret_key");
            // set httpOnly cookie for security
            res.cookie("token", token, { httpOnly: true });
            return res.redirect("dashboard");
        }

        return res.render("login", { error: "Invalid email or password." });
    } catch (error) {
        console.error("Login error:", error);
        // Render the login page with a generic error message on server failures
        return res.status(500).render("login", { error: "Something went wrong while logging in." });
    }
});

//THis route is handling post data
app.post("/posts", async function(req, res){
    const {title, content} = req.body;

    await Post.create({
        title, 
        content
    })
    res.send("Confession Submit")
})



//This Route is showing Form
app.get("/post", async function(req, res){
    let post = await Post.find({})

    res.render("posts", {post})
})



app.get("/allposts", async function (req, res){
    let allposts = await Post.find({})

    res.send(allposts)
})

app.post("/confessions", async function(req, res){
    const {title, content} = req.body;

    await Post.create({
        title, 
        content
    })
    res.redirect("confessions")
    
})

// app.get("/confessions", function(req, res){
//     res.render("confessions")
// })


app.get("/confessions", async function(req, res) {
    const allconfessions = await Post.find({});
    allconfessions.reverse();
    res.render("confessions", {allconfessions});
    
});


app.get('/dashboard', (req, res) => {
  res.render('dashboard');
})

app.get("/delete", async function(req, res){
    let post = await Post.deleteMany({})
    res.send("Routes Deleted")
})

app.post("/lost", async function (req, res) {
    const { itemname, description, lost_location, date } = req.body;

    await Lost.create({
        itemname,
        description,
        lost_location,
        date
    });

    res.redirect("/lost");
});

app.get("/itemlost", async function(req, res){
    let allitems = await Lost.find({})
    res.send(allitems)

})

app.get("/lost", function (req, res) {
    res.render("lost");
});

app.get("/found", async function(req, res){
    let itemfound = await Found.create({
        itemname: "Wallet",
        description: "Black",
        found_location: "Librarys"
    })
    res.send(itemfound)
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});