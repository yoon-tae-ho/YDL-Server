import fetch from "node-fetch";

import User from "../models/User";

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  try {
    const tokenRequest = await (
      await fetch(finalUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })
    ).json();

    // error process
    if (!("access_token" in tokenRequest)) {
      return res.status(404).redirect(`${process.env.CORS_URL}/login`);
    }

    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    // get user data
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find((email) => email.primary && email.verified);

    // error process
    if (!emailObj) {
      return res.status(404).redirect(`${process.env.CORS_URL}/login`);
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      // create account
      user = await User.create({
        email: emailObj.email,
        username: userData.login,
        social: "Github",
        avatarUrl: userData.avatar_url,
      });
    } else {
      user.social = "Github";
      user.avatarUrl = userData.avatar_url;
      await user.save();
    }

    // login
    req.session.loggedIn = true;
    req.session.user = user;

    return res.status(200).redirect(`${process.env.CORS_URL}/`);
  } catch (error) {
    console.log(error);
  }
};
