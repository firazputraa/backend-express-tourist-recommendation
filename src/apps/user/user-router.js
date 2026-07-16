import express from "express";
import * as userController from "./controller.js";
import validate from "../../middlewares/validate.js";
import { requireAuth } from "../../middlewares/auth.js";
import {
  registerSchema,
  loginSchema,
  preferenceValidation,
  likeValidation,
  updateProfileSchema,
} from "../../validations/user-validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);
router.patch(
  "/profile",
  requireAuth,
  validate(updateProfileSchema),
  userController.updateProfile,
);
router.get("/profile", requireAuth, userController.getProfile);
router.post(
  "/preferences",
  requireAuth,
  validate(preferenceValidation),
  userController.setPreferences,
);
router.post(
  "/likes",
  requireAuth,
  validate(likeValidation),
  userController.likePlace,
);
router.get("/likes", requireAuth, userController.getLikedPlaces);
export default router;