import { Router } from "express";
import {
  login,
  signup,
  update,
  confirmUser,
  forgotPassword,
  resetPassword,
} from "../controllers/user.js";

const authRouter = Router();

authRouter.post("/login", login);

authRouter.post("/signup", signup);

authRouter.put("/update", update);

authRouter.patch("/confirm/:id", confirmUser);

authRouter.put("/forgot", forgotPassword);

authRouter.patch("/reset/:id", resetPassword);

export default authRouter;
