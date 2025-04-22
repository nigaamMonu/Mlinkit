import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  const sellerToken = req.cookies.sellerToken;
  if (!sellerToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const sellerTokenDecoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (sellerTokenDecoded.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res.json({ success: false, message: "not authorized" });
    }
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
};

export default authSeller;
