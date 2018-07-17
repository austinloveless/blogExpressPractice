const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});
const Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

//index route
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

//new route
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

//create route
app.post("/blogs", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

//Show route
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

//Edit Routes
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

//update Routes
app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//Delete Routes
app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(port, () => {
  console.log("listening on port", port);
});
