import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import {
   loginValidation,
   postCreateValidation,
   registerValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import { getMe, login, register } from "./controllers/User.js";
import {
   createPost,
   deletePost,
   getAll,
   getOne,
   getTags,
   updatePost,
} from "./controllers/Post.js";

mongoose.connect(
   "mongodb+srv://admin:vlad-vagne@cluster0.avukmzp.mongodb.net/?retryWrites=true&w=majority"
);

const app = express();

const storage = multer.diskStorage({
   destination: (_, __, cb) => {
      cb(null, "uploads");
   },
   filename: (_, file, cb) => {
      cb(null, file.originalname);
   },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
   "/auth/register",
   registerValidation,
   handleValidationErrors,
   register
);
app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.get("/auth/me", checkAuth, getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
   res.json({
      url: `/uploads/${req.file.originalname}`,
   });
});

app.get("/posts", getAll);
app.get("/posts/tags", getTags);
app.get("/tags", getTags);
app.get("/posts/:id", getOne);
app.post(
   "/posts",
   checkAuth,
   postCreateValidation,
   handleValidationErrors,
   createPost
);
app.patch("/posts/:id", checkAuth, handleValidationErrors, updatePost);
app.delete("/posts/:id", checkAuth, deletePost);

app.listen(4444, () => {
   console.log("connected");
});
