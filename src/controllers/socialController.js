import fetch from "node-fetch";

import User from "../models/User";

const loginFailedUrl = `${process.env.CORS_URL}/login`;
const loginSuccessedUrl = `${process.env.CORS_URL}/`;

// Github

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
    // get access token
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
      return res.status(404).redirect(loginFailedUrl);
    }

    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com/user";
    // get user data
    const userData = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // get email data
    const emailData = await (
      await fetch(`${apiUrl}/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObj = emailData.find((email) => email.primary && email.verified);

    // error process
    if (!emailObj) {
      return res.status(404).redirect(loginFailedUrl);
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      // create account
      user = await User.create({
        email: emailObj.email,
        username: userData.login,
        social: "Github",
        avatarUrl: userData.avatar_url || "",
      });
    } else {
      user.social = "Github";
      user.avatarUrl = userData.avatar_url || "";
      await user.save();
    }

    // login
    req.session.loggedIn = true;
    req.session.user = user;

    return res.status(200).redirect(loginSuccessedUrl);
  } catch (error) {
    console.log(error);
  }
};

// Kakao

export const startKakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: "http://localhost:4000/user/social/kakao/finish",
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishKakaoLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT,
    client_secret: process.env.KAKAO_SECRET,
    redirect_uri: "http://localhost:4000/user/social/kakao/finish",
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  try {
    // get access token
    const tokenRequest = await (
      await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          Accept: "application/json;charset=UTF-8",
        },
      })
    ).json();

    // error process
    if (!("access_token" in tokenRequest)) {
      return res.status(404).redirect(loginFailedUrl);
    }

    const { access_token } = tokenRequest;
    const apiUrl = "https://kapi.kakao.com/v2/user/me";
    // get user data
    const userData = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          secure_resource: true,
          property_keys: [
            "properties.nickname",
            "properties.thumbnail_image",
            "kakao_account.email",
          ],
        },
      })
    ).json();

    const {
      properties: { nickname, thumbnail_image },
      kakao_account: { email, has_email },
    } = userData;

    // error process
    if (!has_email) {
      return res.status(404).redirect(loginFailedUrl);
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        username: nickname,
        social: "Kakao",
        avatarUrl: thumbnail_image || "",
      });
    } else {
      user.social = "Kakao";
      user.avatarUrl = thumbnail_image || "";
      await user.save();
    }

    // login
    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect(loginSuccessedUrl);
  } catch (error) {
    console.log(error);
  }
};
