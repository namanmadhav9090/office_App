// controllers/authController.js

const Joi = require("joi");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");
const { sendResponse, sendError } = require("../utils/responseHelper");
const Jwt = require("jsonwebtoken");

// Signup Controller
module.exports = {
  signup: async (req, res) => {
    try {
      const { firstName, lastName, gender, hobbies, email, password, role } =
        req.body;

      const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        gender: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
      });

      const { error } = schema.validate({
        firstName,
        lastName,
        gender,
        email,
        password,
        role,
      });

      if (error) {
        return sendError(res, 400, error.details[0].message);
      }

      const user = await User.findOne({ where: { email } });

      if (user) {
        return sendError(res, 400, "User already exist");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        firstName,
        lastName,
        gender,
        hobbies,
        email,
        password: hashedPassword,
        role,
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return sendResponse(
        res,
        201,
        { newUser, token },
        "User created successfully"
      );
    } catch (err) {
      console.log("err", err);
      logger.error("Error during signup: ", err.message);
      return sendError(res, 500, "Server error");
    }
  },

  login: async (req, res) => {
    const { email, password, role } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return sendError(res, 400, "Invalid email or password");
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
   
       return sendResponse(
        res,
        200,
        { user, token },
       "Login successful"
      );
    } catch (err) {
      console.log('err',err);
      logger.error("Error during login: ", err.message);
      return sendError(res, 500, "Server error");
    }
  },
};
