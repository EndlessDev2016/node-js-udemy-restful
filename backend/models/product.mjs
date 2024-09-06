/* const db = require('../util/database');

const Cart = require('./cart');

// const p = path.join(
//   path.dirname(require.main.filename),
//   'data',
//   'products.json'
// );

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this._id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      `
      INSERT INTO products (title, price, imageUrl, description)
      VALUES (?, ?, ?, ?)
    `,
      [this.title, this.price, this.imageUrl, this.description]
    );
    // getProductsFromFile((products) => {
    //   // 既存の商品情報を更新する
    //   if (this._id) {
    //     const existingProductIndex = products.findIndex(
    //       (p) => p._id === this._id
    //     );

    //     const updatedProducts = [...products];
    //     updatedProducts[existingProductIndex] = this;

    //     // 更新後の商品情報をproducts.jsonに保存する
    //     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
    //       console.log(err);
    //     });
    //   } else {
    //     // 新規商品情報を追加する
    //     this._id = Math.random().toString();
    //     products.push(this);
    //     fs.writeFile(p, JSON.stringify(products), (err) => {
    //       console.log(err);
    //     });
    //   }
    // });
  }

  static deleteById(id) {
    // getProductsFromFile((products) => {
    //   const product = products.findIndex((p) => p._id === id);
    //   const updatedProducts = products.filter((p) => p._id !== id);
    //   fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
    //     if (!err) {
    //       // 商品情報の削除に成功したら、カートからも削除する
    //       Cart.deleteProduct(id, product.price);
    //     }
    //   });
    // });
  }

  static fetchAll(cb) {
    // getProductsFromFile(cb);
    return db.execute(`
      SELECT * FROM products
    `);
  }

  static findById(id, cb) {
    // getProductsFromFile((products) => {
    //   const product = products.find((p) => p._id === id);
    //   cb(product);
    // });

    return db.execute(`SELECT * FROM products WHERE products._id = ?`, [id]);
  }
};
 */

/**
 * Sequelize version
 */

import { DataTypes } from 'sequelize';
import sequelize from '../util/database.mjs';

// Define the model (version 6)
const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Product;
