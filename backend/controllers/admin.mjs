import chalk from "chalk";
// const Product = require('../models/product');
import Product from "../models/product.mjs";
import User from "../models/user.mjs";
import { deleteFile } from "../util/file.mjs";

export const getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }

  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null,
  });
};

export const postAddProduct = (req, res, next) => {
  const title = req.body.title;
  // const imageUrl = req.body.imageUrl;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: "Attached file is not an image.",
      validationErrors: [],
      isAuthenticated: req.session.isLoggedIn,
    });
  }

  const imageUrl = image.path;

  // console.log(chalk.green("postAddProduct :: multer file :: "), req.file);
  // console.log(chalk.green("postAddProduct :: multer image :: "), image);
  // const product = new Product(null, title, imageUrl, description, price);
  // product.save().then(() => {
  //   res.redirect('/');
  // }).catch((err) => console.log(err));

  // special methods
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // User.hasMany(Product);

  User.findByPk(req.session.user.id)
    .then((user) => {
      return user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
      });
    })

    // req.user
    //   .createProduct({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    // })
    // Product.create({
    //   title: title,
    //   price: price,
    //   imageUrl: imageUrl,
    //   description: description,
    //   user: req.user.id
    // })
    .then((result) => {
      console.log("Created Product :: ", result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

export const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  console.log("getEditProduct start ::");
  const prodId = req.params.productId;
  // User.hasMany(Product)のため、associated methodを利用可能。

  User.findByPk(req.session.user.id)
    .then((user) =>
      user.getProducts({
        where: {
          id: prodId,
        },
      })
    )
    // Product.findByPk(prodId)
    .then((products) => {
      // 配列で取得するため、products[0]から値を取得する。
      const [product] = products;
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: null,
      });
    })
    .catch((err) => console.log(err));
};

export const postEditProduct = (req, res, next) => {
  // TODO: Implement postEditProduct
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  // const updatedImageUrl = req.body.imageUrl;
  const image = req.file;
  const updatedDesc = req.body.description;
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );

  // updatedProduct
  //   .save()
  //   .then(() => {
  //     res.redirect('/admin/products');
  //   })
  //   .catch((err) => console.log(err));

  Product.findByPk(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.session.user.id.toString()) {
        return res.redirect("/");
      }
      // 値を更新する（上書き）
      product.title = updatedTitle;
      product.price = updatedPrice;
      if (image) {
        deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      // product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      return product.save();
    })
    .then((result) => {
      console.log("Updated Product :: ", result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

export const getProducts = (req, res, next) => {
  console.log(
    chalk.green("admin :: getProducts - req.session.user :: "),
    req.session.user
  );
  Product.findAll({
    // 一時的にコメントすると、全てのProductが表示される。
    where: {
      userId: req.session.user.id,
    },
  })
    // User.findByPk(req.session.user.id)
    // .then((user) => user.getProducts())
    // Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

export const postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found."));
      }
      deleteFile(product.imageUrl);

      Product.destroy({
        where: {
          id: prodId,
          userId: req.session.user.id,
        },
      })
        // .then((product) => {
        //   return product.destroy();
        // })
        .then((result) => {
          console.log("Product Deleted :: ", result);
          res.redirect("/admin/products");
        });
    })
    .catch((err) => console.log(err));

  // ProductのuserIdがreq.session.user.idと一致する場合のみ、削除する。
  // 他のユーザのProductを削除することはできない。
  // つまり、自分のProductのみ削除できる。
};
