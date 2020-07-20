const express = require("express");
const userService = require("../services/user-service");

module.exports = {
  loginPage(req, res, next) {
    return res.render("pages/login/login.ejs");
  },

  login(req, res, next) {
    userService
      .authenticate(req.body)
      .then((user) => {
        if (!user) {
          res
            .status(400)
            .json({ message: "Username or password is incorrect" });
        } else {
          var sess = req.session;
          sess.user = user;
          res.redirect("/spanning");
        }
      })

      .catch((err) => next(err));
  },

  authenticate(req, res, next) {
    userService
      .authenticate(req.body)
      .then((user) =>
        user
          ? res.json(user)
          : res
              .status(400)
              .json({ message: "Username or password is incorrect" })
      )
      .catch((err) => next(err));
  },

  registerPage(req, res, next) {
    return res.render("pages/login/register.ejs");
  },

  register(req, res, next) {
    console.log("yeet");
    userService
      .create(req.body)
      .then(() => res.redirect("/admin/login"))
      .catch((err) => next(err));
  },

  getAll(req, res, next) {
    userService
      .getAll()
      .then((users) => res.json(users))
      .catch((err) => next(err));
  },

  getCurrent(req, res, next) {
    userService
      .getById(req.user.sub)
      .then((user) => (user ? res.json(user) : res.sendStatus(404)))
      .catch((err) => next(err));
  },

  getById(req, res, next) {
    userService
      .getById(req.params.id)
      .then((user) => (user ? res.json(user) : res.sendStatus(404)))
      .catch((err) => next(err));
  },

  update(req, res, next) {
    userService
      .update(req.params.id, req.body)
      .then(() => res.json({}))
      .catch((err) => next(err));
  },

  _delete(req, res, next) {
    userService
      .delete(req.params.id)
      .then(() => res.json({}))
      .catch((err) => next(err));
  },
};
