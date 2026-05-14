import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  logout,
  getMe,
  getSaved,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email")
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("postcode").optional().trim(),
  ],
  register,
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login,
);

router.post("/logout", logout);
router.get("/me",       protect, getMe);
router.get("/me/saved", protect, getSaved);
router.patch("/me",     protect, updateProfile);
router.patch(
  "/me/password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters"),
  ],
  changePassword,
);

export default router;
