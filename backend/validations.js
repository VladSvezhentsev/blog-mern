import { body } from "express-validator";

export const registerValidation = [
   body("email", "Неправильний формат пошти").isEmail(),
   body("password", "Пароль має бути мiнiмум 5 символiв").isLength({ min: 5 }),
   body("fullName", "Iм'я має бути мiнiмум 3 символа").isLength({ min: 3 }),
   body("avatarUrl", "Неправильне посилання на аватарку").optional().isURL(),
];

export const loginValidation = [
   body("email", "Неправильний формат пошти").isEmail(),
   body("password", "Пароль має бути мiнiмум 5 символiв").isLength({ min: 5 }),
];

export const postCreateValidation = [
   body("title", "Введiть заголовок статтi").isLength({ min: 3 }).isString(),
   body("text", "Введiть текст статтi").isLength({ min: 3 }).isString(),
   body("tags", "Неправильний формат тегiв").optional().isString(),
   body("imageUrl", "Неправильне посилання на зображення")
      .optional()
      .isString(),
];
