import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './util/database.mjs';
import chalk from 'chalk';
import feedRoutes from './routes/feed.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
  console.error(chalk.bgRedBright(message));
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

// // mysql session store options
// const options = {
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: 'dltmdgns',
//   database: 'node-complete',
// };

// const _MySQLStore = MySQLStore(session);
// const sessionStore = new _MySQLStore(options);

// トークン生成用のルートを設定
// app.get('/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// Optionally use onReady() to get a promise that resolves when store is ready.
// sessionStore
//   .onReady()
//   .then(() => {
//     // MySQL session store ready for use.
//     console.log(chalk.bgGreenBright('MySQL session store ready for use.'));
//   })
//   .catch((error) => {
//     // Something went wrong.
//     console.error(error);
//   });

// Rest of the code...

// db.execute('SELECT * FROM products')
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// app.use(
//   session({
//     secret: 'my secret',
//     resave: false,
//     saveUninitialized: false,
//     // cookie: {
//     //   maxAge: 1000 * 60 * 60 * 24 * 7,
//     // },
//   })
// );

/**
 *
 * middlewarebにUser Modelを保存したい場合は、sessionではなく(なぜなら、sessionは、serializeされたデータを保存するため)、
 * middlewareに保存する。（例えば、req.user, req.productなどの、変数を利用する。）
 *
 */
// middleware にユーザを利用するために一時的に保存。
// app.use((req, res, next) => {
//   User.findByPk(1)
//     .then((user) => {
//       req.session.user = user;
//       next();
//     })
//     .catch((err) => console.log(err));
// });

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
// app.use(authRoutes);

// app.use(get404);

// User.hasOne(Cart);
// Cart.belongsTo(User);
// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);

// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// production modeには、force: falseにする。
// 理由は、force: trueにすると、tableがdropされるため。
sequelize
  // This creates the table, dropping it first if it already existed
  // .sync({ force: true })
  // 開発環境のみで使用するのが一般的
  .sync({
    /**
     * If alter is true, each DAO will do ALTER TABLE ... CHANGE ... Alters tables to fit models.
     * Provide an object for additional configuration.
     * Not recommended for production use.
     * If not further configured deletes data in columns that were removed or had their type changed in the model.
     */
    // force: true
    // alter: true,
  })
  .then((cart) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
