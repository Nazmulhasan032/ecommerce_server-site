import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const addUser = async (req, res) => {
  try {
    const userData = req.body; // Assuming the user data is passed in the request body

    // Generate a random user_id consisting of 10 digits
    const user_id = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create a new user instance using the User model
    const newUser = new User({
      ...userData,
      user_id,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Decorate the success response
    const successResponse = {
      success: true,
      message: "User added successfully",
      user: savedUser.toObject(),
    };

    // Remove the hashed password from the response user object
    delete successResponse.user.password;

    res.status(201).json(successResponse); // Respond with the decorated success response
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User did not added successfully",
      error: error,
    });
  }
};


export const login = async (req, res) => {
  const { email, phone, password } = req.body;

  let user;
  if (email) {
    user = await User.findOne({ email });
  } else if (phone) {
    user = await User.findOne({ phone: phone });
  }

  if (!user) {
    return res.json({ status: "error", error: "Invalid login" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
      process.env.TOKEN_SECRET
    );

    return res.json({
      status: "ok",
      accessToken: token,
      uid: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    return res.json({ status: "error", accessToken: false });
  }
};

export const resetPassword = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (isPasswordValid) {
    try {
      const hashPass = bcrypt.hashSync(req.body.newPassword, 8);
      user.password = hashPass;
      user.save();
      res.status(200).json({ message: "Password Reset Successfully" });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  } else {
    res.status(401).json({ message: "Invalid Password" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const userInfo = await User.findOne({ _id: user_id });

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user: userInfo });
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
};

// get all users with pagintion
export const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  try {
    results.results = await User.find().limit(limit).skip(startIndex).exec();
    res.status(200).json({
      success: true,
      status: 200,
      page: page,
      limit: limit,
      data: results,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get user by search query
export const getUserBySearch = async (req, res) => {
  try {
    const user = await User.find({ $text: { $search: req.query.search } });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get user by id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get users by search query
export const getUsersBySearch = async (req, res) => {
  try {
    const user = await User.find({ $text: { $search: req.query.search } });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    // const user_id = req.params.user_id;
    const user_id = req.params.id;
    const updates = req.body;
    console.log("params", req.params);
    console.log("user_id", user_id);
    console.log("updates", updates);

    // Find the user by user_id and update the information
    const updatedUser = await User.findOneAndUpdate({ _id:user_id }, updates, {
      new: true,
    });
    console.log("updatedUser", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const user = await User.findOne({ user_id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = user.orders;
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to get orders" });
  }
};
