import fetch from "node-fetch";

import User from "../models/User";

const isHeroku = process.env.NODE_ENV === "production";
const corsUrl = process.env.CORS_URLS.split(" ")[0];
const loginFailedUrl = `${corsUrl}/login`;
const loginSuccessedUrl = `${corsUrl}/`;

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
    req.session.user = user;
    req.session.loggedIn = true;

    return res.status(200).redirect(loginSuccessedUrl);
  } catch (error) {
    console.log(error);
    return res.status(404).redirect(loginFailedUrl);
  }
};

// Kakao

export const startKakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: `${window.location.origin}/user/social/kakao/finish`,
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
    redirect_uri: `${window.location.origin}/user/social/kakao/finish`,
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
      email,
      has_email,
      profile: { nickname, thumbnail_image_url },
    } = userData.kakao_account;

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
        avatarUrl: thumbnail_image_url || "",
      });
    } else {
      user.social = "Kakao";
      user.avatarUrl = thumbnail_image_url || "";
      await user.save();
    }

    // login
    req.session.user = user;
    req.session.loggedIn = true;

    return res.redirect(loginSuccessedUrl);
  } catch (error) {
    console.log(error);
    return res.status(404).redirect(loginFailedUrl);
  }
};

// Naver

export const startNaverLogin = (req, res) => {
  const baseUrl = "https://nid.naver.com/oauth2.0/authorize";
  const config = {
    client_id: process.env.NAVER_CLIENT,
    response_type: "code",
    redirect_uri: `${window.location.origin}/user/social/naver/finish`,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishNaverLogin = async (req, res) => {
  const baseUrl = "https://nid.naver.com/oauth2.0/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.NAVER_CLIENT,
    client_secret: process.env.NAVER_SECRET,
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
          Accept: "application/json;charset=UTF-8",
        },
      })
    ).json();

    if (!("access_token" in tokenRequest)) {
      return res.status(404).redirect(loginFailedUrl);
    }

    const { access_token } = tokenRequest;
    const apiUrl = "https://openapi.naver.com/v1/nid/me";
    // get user data
    const userData = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json;charset=utf-8",
          Accept: "application/json;charset=utf-8",
        },
      })
    ).json();

    // error process
    if (userData.message !== "success") {
      return res.status(404).redirect(loginFailedUrl);
    }

    const { nickname, email, profile_image, name } = userData.response;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        username:
          nickname[nickname.length - 1] === "*" && name ? name : nickname,
        social: "Naver",
        avatarUrl: profile_image || "",
      });
    } else {
      user.social = "Naver";
      user.avatarUrl = profile_image || "";
      await user.save();
    }

    // login
    req.session.user = user;
    req.session.loggedIn = true;

    return res.redirect(loginSuccessedUrl);
  } catch (error) {
    console.log(error);
    return res.status(404).redirect(loginFailedUrl);
  }
};

// Google

export const startGoogleLogin = (req, res) => {
  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const config = {
    client_id: process.env.GOOGLE_CLIENT,
    redirect_uri: `${window.location.origin}/user/social/google/finish`,
    response_type: "code",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGoogleLogin = async (req, res) => {
  const baseUrl = "https://oauth2.googleapis.com/token";
  const config = {
    client_id: process.env.GOOGLE_CLIENT,
    client_secret: process.env.GOOGLE_SECRET,
    code: req.query.code,
    grant_type: "authorization_code",
    redirect_uri: `${window.location.origin}/user/social/google/finish`,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  try {
    // get access token
    const tokenRequest = await (
      await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json;charset=UTF-8",
        },
      })
    ).json();

    // error process
    if (!("access_token" in tokenRequest)) {
      return res.status(404).redirect(loginFailedUrl);
    }

    const { access_token } = tokenRequest;
    const apiUrl = "https://www.googleapis.com/userinfo/v2/me";
    // get user data
    const userData = await (
      await fetch(`${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json;charset=utf-8",
        },
      })
    ).json();

    if (!userData.email) {
      return res.status(404).redirect(loginFailedUrl);
    }

    const { email, name, picture } = userData;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        username: name,
        social: "Google",
        avatarUrl: picture || "",
      });
    } else {
      user.social = "Google";
      user.avatarUrl = picture || "";
      await user.save();
    }

    // login
    req.session.user = user;
    req.session.loggedIn = true;

    return res.redirect(loginSuccessedUrl);
  } catch (error) {
    console.log(error);
    return res.status(404).redirect(loginFailedUrl);
  }
};
