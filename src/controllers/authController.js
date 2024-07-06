import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

export const register = async (req, res) => {
  const { first_name, last_name, email, age, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "El correo electrónico ya está registrado");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();
    req.flash(
      "success",
      "Usuario registrado exitosamente. Por favor, inicia sesión."
    );
    return res.redirect("/login");
  } catch (error) {
    console.error(error);
    req.flash("error", "Hubo un error en el registro");
    return res.redirect("/register");
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", "Credenciales incorrectas");
      return res.redirect("/login");
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.SESSION_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("jwt", token, { httpOnly: true });
      return res.redirect("/api/products");
    });
  })(req, res, next);
};

export const logout = (req, res, next) => {
  res.clearCookie("jwt");
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};