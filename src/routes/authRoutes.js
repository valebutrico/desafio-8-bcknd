import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";
import passport from "passport";
import { current } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/login", (req, res) => res.render("login"));

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/api/products",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/register", (req, res) => res.render("register"));
router.post("/register", register);
router.post("/logout", logout);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/api/products"); 
  }
);

router.get("/current", current, (req, res) => {
  res.json(req.user);
});

export default router;