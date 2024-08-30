import PDFDocument from "pdfkit";
import chalk from "chalk";
import path from "path";
import fs from "fs";
import Order from "../models/order.mjs";

// const Product = require('../models/product');
import Product from "../models/product.mjs";
import User from "../models/user.mjs";
import { createReadStream } from "fs";
// const Cart = require('../models/cart');
// import Cart from '../models/cart';

export const getProducts = (req, res, next) => {
  // filterする。
  // Product.findAll()
  //   .then((prods) => {
  //     res.render("shop/product-list", {
  //       prods: prods,
  //       pageTitle: "All Products",
  //       path: "/products",
  //       isAuthenticated: req.session.isLoggedIn,
  //     });
  //   })
  //   .catch((err) => console.log(err));

  console.log(chalk.greenBright("shop.mjs - getProducts"));
  const page = +req.query.page || 1;
  let totalItems;
  console.log(chalk.greenBright("shop.mjs - getProducts - page :: "), page);

  Product.findAndCountAll({
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  })
    .then((result) => {
      totalItems = result.count;
      return result.rows;
    })
    .then((prods) => {
      res.render("shop/product-list", {
        prods: prods,
        pageTitle: "All Products",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

export const getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // where: { id: prodId } で条件を指定することで、idが一致するレコードを取得する
  Product.findAll({ where: { id: prodId } })
    .then((products) => {
      const product = products[0];
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
  // Product.findByPk(prodId)
  //   .then((product) => {
  //     res.render('shop/product-detail', {
  //       product: product,
  //       pageTitle: product.title,
  //       path: '/products',
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

const ITEMS_PER_PAGE = 2;

export const getIndex = (req, res, next) => {
  console.log(chalk.green("shop.mjs - getIndex"));
  const page = +req.query.page || 1;
  let totalItems;
  console.log(chalk.green("shop.mjs - getIndex - page :: "), page);

  Product.findAndCountAll({
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  })
    .then((result) => {
      totalItems = result.count;
      return result.rows;
    })
    .then((prods) => {
      res.render("shop/index", {
        prods: prods,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));

  // Product.findAll({
  //   offset: (page - 1) * ITEMS_PER_PAGE,
  //   limit: ITEMS_PER_PAGE,
  // })
  //   .then((prods) => {
  //     // console.log("prods :: ", prods);
  //     res.render("shop/index", {
  //       prods: prods,
  //       pageTitle: "Shop",
  //       path: "/",
  //       // csrfToken: req.csrfToken(), // CSRFトークンをテンプレートに渡す
  //       isAuthenticated: req.session.isLoggedIn,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

export const getCart = (req, res, next) => {
  User.findByPk(req.session.user.id)
    .then((user) => user.getCart())
    .then((cart) => {
      /**
       * getCart ::  cart {
       * dataValues: {
       *   id: 1,
       *   createdAt: 2024-07-15T07:00:26.000Z,
       *   updatedAt: 2024-07-15T07:00:26.000Z,
       *   userId: 1
       * },
       */
      console.log(chalk.green("getCart (then) - user.getCart() :: "), cart);
      if (!cart) {
        return [];
      }

      return cart.getProducts();
    })
    .then((cartProducts) => {
      console.log(
        chalk.green("getCart (then) - cartProducts :: "),
        cartProducts
      );
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));

  // Cart.getCart((cart) => {
  //   Product.findAll()
  //     .then((products) => {
  //       const cartProducts = [];

  //       for (let product of products) {
  //         if (cart.products.find((prod) => prod.id === product.id)) {
  //           const cartProductData = cart.products.find(
  //             (prod) => prod.id === product.id
  //           );

  //           cartProducts.push({
  //             productData: product,
  //             qty: cartProductData.qty,
  //           });
  //         }
  //       }

  //       res.render('shop/cart', {
  //         path: '/cart',
  //         pageTitle: 'Your Cart',
  //         products: cartProducts,
  //       });
  //     })
  //     .catch((err) => console.log(err));
  // });
};

export const postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let product;
  let newQuantity = 1;

  User.findByPk(req.session.user.id)
    .then((user) => user.getCart())
    .then((cart) => {
      console.log(chalk.green("postCart - user.getCart() ::"), cart);

      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      console.log(chalk.green("postCart - getProducts() :: "), products);
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: {
          quantity: newQuantity,
        },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  // Product.findByPk(prodId)
  //   .then((product) => {
  //     Cart.addProduct(prodId, product.price);
  //   })
  //   .catch((err) => console.log(err));
  // res.redirect('/cart');
};

export const postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  User.findByPk(req.session.user.id)
    .then((user) => user.getCart())
    .then((cart) => {
      console.log(
        chalk.green("postCartDeleteProduct - user.getCart() ::"),
        cart
      );
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      console.log(
        chalk.green("postCartDeleteProduct - cart.getProducts() ::"),
        products
      );
      const product = products[0];

      product.cartItem.destroy().then((result) => {
        console.log(
          chalk.green("postCartDeleteProduct - product.cartItem.destroy() ::"),
          result
        );
        return result;
      });
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));

  // Product.findById(prodId)
  //   .then((product) => {
  //     Cart.deleteProduct(prodId, product.price);
  //     res.redirect('/cart');
  //   })
  //   .catch((err) => console.log(err));
};

export const postOrder = (req, res, next) => {
  let fetchedCart;

  User.findByPk(req.session.user.id)
    .then((user) => user.getCart())
    .then((cart) => {
      fetchedCart = cart;
      console.log(chalk.green("postOrder (then) - getCart() :: "), cart);
      return cart.getProducts();
    })
    .then((products) => {
      console.log(
        chalk.green("postOrder (then) - getProducts() :: "),
        products
      );
      return User.findByPk(req.session.user.id)
        .then((user) => user.createOrder())
        .then((order) => {
          console.log(
            chalk.green("postOrder (then) - createOrder() :: "),
            order
          );
          const addProducts = products.map((product) => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          });
          console.log(chalk.green("postOrder - addProducts :: "), addProducts);
          return order.addProducts(addProducts);
        })
        .catch((err) => console.log(err));
    })
    .then(() => {
      console.log(chalk.green("postOrder - fetchedCart.setProducts :: "));
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

export const getOrders = (req, res, next) => {
  User.findByPk(req.session.user.id)
    .then((user) => user.getOrders({ include: ["products"] }))
    .then((orders) => {
      console.log(chalk.green("getOrders (then) - getOrders() :: "), orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

export const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
    isAuthenticated: req.session.isLoggedIn,
  });
};

export const getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findByPk(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found."));
      }
      if (order.userId !== req.session.user.id) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
        // 'attachment; filename="' + invoiceName + '"'
      );

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("-----------------------");
      let totalPrice = 0;
      order.getProducts().then((products) => {
        debugger;
        products.forEach((prod) => {
          totalPrice += prod.orderItem.quantity * prod.price;
          pdfDoc
            .fontSize(14)
            .text(
              prod.title +
                " - " +
                prod.orderItem.quantity +
                " x " +
                "$" +
                prod.price
            );
        });
        pdfDoc.text("---");
        pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);
        pdfDoc.end();
      });

      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     // 'inline; filename="' + invoiceName + '"'
      //     'attachment; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
      // fs.createReadStreamの利点は、大きなファイルを扱う際に、メモリを効率的に使えることが挙げられる。
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   'inline; filename="' + invoiceName + '"'
      //   // 'attachment; filename="' + invoiceName + '"'
      // );
      // file.pipe(res);
    })
    .catch((err) => next(err));
  // const invoiceName = "invoice-" + orderId + ".pdf";
  // const invoicePath = path.join("data", "invoices", invoiceName);
  // fs.readFile(invoicePath, (err, data) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.setHeader("Content-Type", "application/pdf");
  //   res.setHeader(
  //     "Content-Disposition",
  //     // 'inline; filename="' + invoiceName + '"'
  //     'attachment; filename="' + invoiceName + '"'
  //   );
  //   res.send(data);
  // });
};
