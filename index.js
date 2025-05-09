const express = require("express");
const cors = require("cors");
const axios = require("axios");
const secureCookie = require("./services/index");
const cookieParser = require("cookie-parser");
const { verifyAccessToken } = require("./middleware/index");
const { sequelize } = require("./models");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(cookieParser());

app.get("/", async (req, res) => {
  return res.send(`<h1>Welcome to Socially server!</h1>`);
});

app.get("/user/profile/github", verifyAccessToken, async (req, res) => {
  console.log("Reached /user/profile/github route");
  try {
    const { access_token } = req.cookies;
    const githubUserResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    res.json({ user: githubUserResponse.data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/auth/github", async (req, res) => {
  const gtihubAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user,repo,security_events`;
  res.redirect(gtihubAuthURL);
});

app.get("/auth/github/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json.send("Authorization code not provided");
  }
  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // res.cookie("access_token", accessToken);
    secureCookie(res, accessToken);
    // return res.redirect(`${process.env.FRONTEND_URL}/v2/profile/github`);
    return res.json({ accessToken });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("unable to connect to database", error));

app.listen(PORT, () => {
  console.log(`server is listening to port ${PORT}`);
});
