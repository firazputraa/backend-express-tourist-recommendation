import express from "express";
import * as placeController from "./controller.js";
import { verifyToken } from "../../utils/jwt.js";

const router = express.Router();
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ error: "Akses ditolak. Token tidak ditemukan." });
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    console.log("❌ Backend menolak token karena:", err.message);
    res.status(401).json({ error: "Token tidak valid atau sudah kadaluarsa." });
  }
};

router.get("/popular", placeController.getPopularPlaces);
router.get("/search", placeController.searchPlaces);
router.get("/:placeId/similar", placeController.getSimilarPlaces);
router.get("/random-places", placeController.getRandomPlaces);
router.get("/recommendations", requireAuth, placeController.getRecommendations);

export default router;
