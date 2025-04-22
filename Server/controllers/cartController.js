import User from "../models/user.js";

// update user cart data : /api/cart/update

export const upadateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    await User.findByIdAndUpdate(userId, { cartItems });
    res.json({ success: true, message: "cart updated" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
