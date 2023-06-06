import { Router } from "express";
import {
  addUser,
  login,
  resetPassword,
  updateUser,
  getUser,
  getAllUsers,
} from "../controllers/user.controller.js";
import { checkToken } from "../middleware/checkToken.js";

const router = Router();

router.post("/register", addUser);
router.post("/login", login);
router.post("/resetPassword", checkToken, resetPassword);
router.patch("/:id", checkToken, updateUser);
router.get("/", checkToken, getUser);
router.get("/all", checkToken, getAllUsers);

export default router;
