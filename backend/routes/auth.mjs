import express, { Router } from 'express';
import { postLogin, putSignup } from '../controllers/auth.mjs';
import { check, body, param, query, cookie, header } from 'express-validator';
import User from '../models/user.mjs';
// body, param, query, cookie, headerなどがチェックできる。

const authRouter = express.Router();

authRouter.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email. :)')
      .custom((value, meta) => {
        const { req, location, path } = meta;
        return User.findOne({
          where: { email: value },
        }).then((user) => {
          // TODO: Check if email already exists
          if (user) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one. Email重複！存在するよ async validation version. :('
            );
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .isLength({ min: 4 })
      .withMessage('Please enter a password with at least 4 characters. :)')
      .isAlphanumeric()
      .trim(),
  ],
  putSignup
);

authRouter.post('/login', postLogin);



//// 以下は、以前のudemyコード。参照。
// router.get("/login", getLogin);

// router.get("/signup", getSignup);

// router.post(
//   "/login",
//   [
//     body("email").isEmail().withMessage("Please enter a valid email. :)"),
//     body("password").isLength({ min: 4 }).isAlphanumeric(),
//   ],
//   postLogin
// );

// router.post("/logout", postLogout);

// router.post(
//   "/signup",
//   [
//     check("email")
//       .isEmail()
//       .withMessage("Please enter a valid email. :)")
//       .custom((value, { req, location, path }) => {
//         // if (value !== "lee@test.com") {
//         //   // throw new Error(
//         //   //   "This email address is forbidden. admin : lee@test.com :("
//         //   // );
//         //   return Promise.reject("This email address is forbidden. admin : lee@test.com promise.recject ver");

//         // }
//         // return true;

//         // 298. Adding Async Validation
//         return User.findOne({
//           where: { email: /* req.body.emailも可能。 */ value },
//         }).then((user) => {
//           if (user) {
//             return Promise.reject(
//               "E-Mail exists already, please pick a different one. Email重複！存在するよ async validation version. :("
//             );
//           }
//         });
//         // .catch((err) => console.log(err));

//         // async/await version. 上記は、asyncに変更。async (value, {req, ....}

//         // const result = await User.findOne({
//         //   where: { email: /* req.body.emailも可能。 */ value },
//         // })
//         //   .then((user) => user)
//         //   .catch((err) => console.log(err));
//         // if (result) {
//         //   return Promise.reject(
//         //     "E-Mail exists already, please pick a different one. Email重複！存在するよ async validation version. :("
//         //   );
//         // }
//       })
//       .normalizeEmail(),
//     // check() ... 他のバリデーションがある場合追加。
//     body("password")
//       .isLength({ min: 4 })
//       .withMessage("Please enter a password with at least 4 characters. :)")
//       .isAlphanumeric()
//       .trim(),
//     body("confirmPassword")
//       .custom((value, { req, location, path }) => {
//         if (value !== req.body.password) {
//           throw new Error("Passwords have to match! 合わねーよ！ :(");
//         }
//         return true;
//       })
//       .trim(),
//   ],
//   postSignup
// );

// router.get("/reset", getReset);

// router.post("/reset", postReset);

// router.get("/reset/:token", getNewPassword);

// router.post("/new-password", postNewPassword);

export default authRouter;
