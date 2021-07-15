require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const dns = require("dns");
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

const dburi = process.env.DB_URI;

mongoose
  .connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    })
  )
  .catch((err) => console.error(err));

//! Set up Schema to be used

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true },
});

const Url = mongoose.model("UrlsAndShortVersion", urlSchema);

//! Schema above

// Url.find() to get all instances of database
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:num", function (req, res) {
  Url.find({ short_url: req.params.num }).then((result) => {
    if (result.length > 0) {
      res.redirect(result[0].original_url);
    } else {
      res.json({ error: "there is no specified short url in the database" });
    }
  });
});

app.post("/api/shorturl", (req, res) => {
  let domain = "";
  try {
    domain = new URL(req.body.url);
  } catch {
    return res.json({ error: "invalid url" });
  }

  const httpRegex = /^(http|https)(:\/\/)/;
  if (!httpRegex.test(req.body.url)) {
    return res.json({ error: "invalid url" });
  }
  dns.lookup(domain.host, (err) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      Url.find({ original_url: req.body.url }).then((result) => {
        if (result.length === 0) {
          Url.find().then((result) => {
            currentNum = result.length + 1;
            const url = new Url({
              original_url: req.body.url,
              short_url: currentNum,
            });
            url.save();
            res.send({
              original_url: req.body.url,
              short_url: currentNum,
            });
          });
        } else {
          res.send({
            original_url: result[0].original_url,
            short_url: result[0].short_url,
          });
        }
      });
    }
  });
});
