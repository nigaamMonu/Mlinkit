import jwt from "jsonwebtoken";

// seller login: /api/seller/login

export const sellerLogin = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please provide email and password",
      });
    }

    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30*24*60*60*1000,
      });
      return res.json({ success: true, message: "Logged In as admin" });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// seller auth :/api/seller/is-auth

export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// seller logout : /api/seller/logut

export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({
      success: true,
      message: "Seller Logged out successfully.",
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
