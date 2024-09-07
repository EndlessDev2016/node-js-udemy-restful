import chalk from 'chalk';
import User from '../models/user.mjs';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { body, validationResult, check } from 'express-validator';

export const putSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      return User.create({
        email,
        password: hashedPassword,
        name,
      });
      // 以下のコードは、sequelizeを使用している場合のコード。
      // User.create({
      //   email: email,
      //   name: name,
      //   password: hashedPassword,
      //   status: 'I am new!',
      // })
      //   .then((user) => {
      //     console.log(chalk.green('---putSignup user---'), user);
      //     return res.status(422).json({
      //       message: 'User created!',
      //       userId: user.id,
      //     });
      //   })
      //   .catch((err) => console.log(err));
    }).then((user) => {
      console.log(chalk.green('---putSignup user---'), user);
      return res.status(422).json({
        message: 'User created!',
        userId: user.id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// 以下のコードは、以前のudemy講座で使用したコード。参照。
// export const getSignup = (req, res, next) => {
//   res.render('auth/signup', {
//     path: '/signup',
//     pageTitle: 'Signup',
//     isAuthenticated: false,
//     errorMessage: null,
//     oldInput: {
//       email: '',
//       password: '',
//       confirmPassword: '',
//     },
//     validationErrors: [],
//   });
// };

// export const postSignup = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const confirmPassword = req.body.confirmPassword;
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     console.log(
//       chalk.red('---auth.mjs - postSignup() errors---'),
//       errors.array()
//     );
//     return res.status(422).render('auth/signup', {
//       path: '/signup',
//       pageTitle: 'Signup',
//       isAuthenticated: false,
//       errorMessage: errors.array()[0].msg,
//       oldInput: {
//         email,
//         password,
//         confirmPassword,
//       },
//       validationErrors: errors.array(),
//     });
//   }

//   // routes/auth.mjs:43から Middleware処理をしているので、重複ユーザのチェックは不要。
//   bcrypt.hash(password, 12).then((hashedPassword) => {
//     User.create({
//       email: email,
//       password: hashedPassword,
//     })
//       .then((user) => {
//         console.log(chalk.green('---postSignup user---'), user);
//         user.createCart();
//         return res.status(422).render('auth/login', {
//           path: '/login',
//           pageTitle: 'Login',
//           isAuthenticated: false,
//           errorMessage: 'Invalid email or password. :(...',
//           oldInput: {
//             email,
//             password,
//           },
//           validationErrors: [
//             // {
//             //   path: "email",
//             //   path: "password",
//             // },
//           ],
//         });
//       })
//       .catch((err) => console.log(err));
//   });
// };

// export const getLogin = (req, res, next) => {
//   // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];

//   console.log(
//     chalk.yellow('---session req.session---'),
//     req.session.isLoggedIn
//   );

//   res.render('auth/login', {
//     path: '/login',
//     pageTitle: 'Login',
//     isAuthenticated: false,
//     errorMessage: 'Invalid email or password. :(...',
//     oldInput: {
//       email: '',
//       password: '',
//     },
//     validationErrors: [
//       // {
//       //   path: "email",
//       //   path: "password",
//       // },
//     ],
//   });
// };

// /**
//  *
//  *
//  * @description
//  * Secureとは、HTTPSを使用しているかどうかを示す。
//  * HttpOnlyとは、JavaScriptからCookieにアクセスできないようにするための属性。
//  * Expiresとは、Cookieの有効期限を設定するための属性。
//  * Max-Ageとは、Cookieの有効期限を秒単位で設定するための属性。
//  */
// export const postLogin = (req, res, next) => {
//   // res.setHeader(
//   //   'Set-Cookie',
//   //   // 'loggedIn=true; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=10; Secure; HttpOnly;'
//   //   'loggedIn=true; HttpOnly;'
//   // );

//   const email = req.body.email;
//   const password = req.body.password;
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     console.log(
//       chalk.red('---auth.mjs - postLogin() errors---'),
//       errors.array()
//     );
//     return res.status(422).render('auth/login', {
//       path: '/login',
//       pageTitle: 'Login',
//       isAuthenticated: false,
//       errorMessage: errors.array()[0].msg,
//       oldInput: {
//         email,
//         password,
//       },
//       validationErrors: errors.array(),
//     });
//   }

//   // express-sessionを利用するexample
//   User.findOne({ where: { email: email } })
//     .then((user) => {
//       if (!user) {
//         return res.status(422).render('auth/login', {
//           path: '/login',
//           pageTitle: 'Login',
//           isAuthenticated: false,
//           errorMessage: 'Invalid email or password. :(...',
//           oldInput: {
//             email,
//             password,
//           },
//           validationErrors: [
//             // {
//             //   path: "email",
//             //   path: "password",
//             // },
//           ],
//         });
//       }

//       bcrypt
//         .compare(password, user.password)
//         .then((doMatch) => {
//           if (doMatch) {
//             req.session.user = user;
//             req.session.isLoggedIn = true;
//             return req.session.save((err) => {
//               console.log(
//                 chalk.yellow('---postLogin req.session.save---'),
//                 err
//               );
//               res.redirect('/');
//             });
//           } else {
//             return res.status(422).render('auth/login', {
//               path: '/login',
//               pageTitle: 'Login',
//               isAuthenticated: false,
//               errorMessage: 'Invalid email or password. :(...',
//               oldInput: {
//                 email,
//                 password,
//               },
//               validationErrors: [
//                 // {
//                 //   path: "email",
//                 //   path: "password",
//                 // },
//               ],
//             });
//           }
//         })
//         .catch((err) => console.log(err));

//       // req.session.user = user;
//       // req.session.isLoggedIn = true;
//       // res.redirect("/");
//     })
//     .catch((err) => console.log(err));
// };

// /**
//  * ログアウト処理
//  *
//  * @description
//  * req.session.destoryは、セッションを削除するメソッド。
//  */
// export const postLogout = (req, res, next) => {
//   console.log(chalk.yellow('---postLogout req.session---'), req.session);
//   req.session.destroy((err) => {
//     console.log(chalk.red('---postLogout req.session.destroy---'), err);
//     res.redirect('/');
//   });
// };

// export const getReset = (req, res, next) => {
//   res.render('auth/reset', {
//     path: '/reset',
//     pageTitle: 'Reset Password',
//     isAuthenticated: false,
//   });
// };

// export const postReset = (req, res, next) => {
//   crypto.randomBytes(32, (err, buffer) => {
//     if (err) {
//       console.log(err);
//       return res.redirect('/reset');
//     }

//     const token = buffer.toString('hex');
//     User.findOne({ where: { email: req.body.email } })
//       .then((user) => {
//         if (!user) {
//           console.log('---postReset--- : ');
//           return res.redirect('/reset');
//         }

//         user.resetToken = token;
//         user.resetTokenExpiration = Date.now() + 3600000;
//         return user.save();
//       })
//       .then((result) => {
//         console.log(chalk.bgBlue('----email 送信実装なし。手動 reset----'));
//         console.log(chalk.bgBlue(`http://localhost:3000/reset/${token}`));
//         res.redirect('/');
//       })
//       .catch((err) => console.log(err));
//   });
// };

// export const getNewPassword = (req, res, next) => {
//   const token = req.params.token;
//   User.findOne({
//     where: {
//       resetToken: token,
//       resetTokenExpiration: {
//         [Op.gt]: Date.now(),
//       },
//     },
//   })
//     .then((user) => {
//       res.render('auth/new-password', {
//         path: '/new-password',
//         pageTitle: 'New Password',
//         userId: user._id.toString(),
//         passwordToken: token,
//         isAuthenticated: false,
//       });
//     })
//     .catch((err) => console.log(err));
// };

// export const postNewPassword = (req, res, next) => {
//   const newPassword = req.body.password;
//   const userId = req.body.userId;
//   const passwordToken = req.body.passwordToken;
//   let resetUser;

//   User.findOne({
//     where: {
//       resetToken: passwordToken,
//       resetTokenExpiration: {
//         [Op.gt]: Date.now(),
//       },
//       id: userId,
//     },
//   })
//     .then((user) => {
//       resetUser = user;
//       return bcrypt.hash(newPassword, 12);
//     })
//     .then((hashedPassword) => {
//       resetUser.password = hashedPassword;
//       resetUser.resetToken = null;
//       resetUser.resetTokenExpiration = null;
//       return resetUser.save();
//     })
//     .then((result) => {
//       console.log(chalk.bgGreen('----postNewPassword success----'));

//       return res.status(422).render('auth/login', {
//         path: '/login',
//         pageTitle: 'Login',
//         isAuthenticated: false,
//         errorMessage: 'Invalid email or password. :(...',
//         oldInput: {
//           email,
//           password,
//         },
//         validationErrors: [
//           // {
//           //   path: "email",
//           //   path: "password",
//           // },
//         ],
//       });
//     })
//     .catch((err) => console.log(err));
// };
