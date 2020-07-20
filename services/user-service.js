const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/user')
module.exports = {
  async authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return {
        ...user.toJSON(),
        token,
      };
    }
  },

  async getAll() {
    return await User.find();
  },

  async getById(id) {
    return await User.findById(id);
  },

  async create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
      throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
      user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
  },

  async update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw "User not found";
    if (
      user.username !== userParam.username &&
      (await User.findOne({ username: userParam.username }))
    ) {
      throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
      userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
  },

  async _delete(id) {
    await User.findByIdAndRemove(id);
  },
};
