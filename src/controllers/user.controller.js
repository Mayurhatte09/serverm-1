const User = require('../models/user.model');

class UserController {
  // Create new user
  static async createUser(req, res) {
    try {
      const { name, email, password, department } = req.body;

      // if (!name || !email || !password || !department) {
      //   return res.status(400).json({ message: "All fields are required" });
      // }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new User({ name, email, password, department });
      await newUser.save();

      res.status(201).json({
        message: "User created successfully",
        user: newUser
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Get all users with pagination
  static async getAllUsers(req, res) {
    try {
      let { page, limit, search, role, department } = req.query;

      page = parseInt(page) || 1;
      limit = parseInt(limit) || 5;
      const skip = (page - 1) * limit;

      // build query object
      let query = {};

      // ✅ search (on name/email)
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } }, // case-insensitive
          { email: { $regex: search, $options: "i" } }
        ];
      }

      // ✅ filter by role if provided
      if (role) {
        query.role = role;
      }

      // ✅ filter by department if provided
      if (department) {
        query.department = department;
      }

      const totalItems = await User.countDocuments(query);

      const users = await User.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ _id: 1 });

      // ✅ unique departments list from DB (instead of dummy)
      const departments = await User.distinct("department");

      res.status(200).json({
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        data: users,
        departments // send in response
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getUsersByIds(req, res) {
    try {
      const { ids } = req.body; // expecting { "ids": ["id1", "id2", "id3"] }

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "IDs array is required" });
      }

      const users = await User.find({ _id: { $in: ids } });

      res.status(200).json({
        count: users.length,
        data: users
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Update user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, department } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, password, department },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = UserController;
