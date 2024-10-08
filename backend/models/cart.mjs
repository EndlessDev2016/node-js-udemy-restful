// const fs = require('fs');
// const path = require('path');

// const p = path.join(path.dirname(require.main.filename), 'data', 'carts.json');

// module.exports = class Cart {
//   // constructor() {
//   //   this.products = [];
//   //   this.totalPrice = 0;
//   // }

//   static addProduct(id, productPrice) {
//     // TODO: Fetch the previous cart
//     // Analyze the cart => Find existing product
//     // Add new product/ increase quantity

//     fs.readFile(p, (err, fileContent) => {
//       let cart = { products: [], totalPrice: 0 };
//       if (!err) {
//         cart = JSON.parse(fileContent);
//       }

//       const existingProductIndex = cart.products.findIndex(
//         (prod) => prod._id === id
//       );
//       const existingProduct = cart.products[existingProductIndex];
//       let updatedProduct;
//       if (existingProduct) {
//         updatedProduct = { ...existingProduct };
//         updatedProduct.qty = updatedProduct.qty + 1;
//         cart.products = [...cart.products];
//         cart.products[existingProductIndex] = updatedProduct;
//       } else {
//         updatedProduct = { id: id, qty: 1 };
//         cart.products = [...cart.products, updatedProduct];
//       }
//       cart.totalPrice = cart.totalPrice + Number(productPrice);
//       fs.writeFile(p, JSON.stringify(cart), (err) => {
//         console.log(err);
//       });
//     });
//   }

//   static deleteProduct(id, productPrice) {
//     fs.readFile(p, (err, fileContent) => {
//       if (err) {
//         return;
//       }

//       const updatedCart = { ...JSON.parse(fileContent) };
//       const product = updatedCart.products.find((prod) => prod._id === id);
//       console.log('product :: ', product);
//       if (!product) {
//         // product not found
//         return;
//       }

//       const productQty = product.qty;

//       updatedCart.products = updatedCart.products.filter(
//         (prod) => prod._id !== id
//       );

//       updatedCart.totalPrice =
//         updatedCart.totalPrice - productPrice * productQty;

//       fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
//         console.log(err);
//       });
//     });
//   }

//   static getCart(cb) {
//     fs.readFile(p, (err, fileContent) => {
//       const cart = JSON.parse(fileContent);
//       if (err) {
//         cb(null);
//       } else {
//         cb(cart);
//       }
//     });
//   }
// };

// const { DataTypes } = require('sequelize');
import { DataTypes } from 'sequelize';

// const sequelize = require('../util/database');
import sequelize from '../util/database.mjs';

const Cart = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

export default Cart;
