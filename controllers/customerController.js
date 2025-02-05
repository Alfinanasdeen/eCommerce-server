import User from "../models/User.js";

export const getAllCustomers = async (req, res) => {
  try {
    // Find all users where userType is not 'admin'
    const users = await User.find(
      { userType: { $ne: "Admin" } },
      { password: 0 }
    ); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error while fetching customers" });
  }
};

// Delete User Controller
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Extract ID from request parameters
    const deletedUser = await User.findByIdAndDelete(userId); // Delete user by ID

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" }); // If user does not exist
    }

    res.status(200).json({ message: "User deleted successfully" }); // Success response
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" }); // Error response
  }
};
