import { verifyToken } from "../utils/jwt.js";

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ error: "Akses ditolak. Token tidak ditemukan." });
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    res.status(401).json({ error: "Token tidak valid atau sudah kadaluarsa." });
  }
};
