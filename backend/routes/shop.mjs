import express from "express";

import {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  getOrders,
  getCheckout,
  postOrder,
  getInvoice,
} from "../controllers/shop.mjs";
import isAuth from "../middleware/is-auth.mjs";

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

// routerは、Top to Bottomで評価される。
// router.get('/product/detail');
router.get("/products/:productId", getProduct);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, postCartDeleteProduct);

router.post("/create-order", isAuth, postOrder);

router.get("/orders", isAuth, getOrders);

router.get("/orders/:orderId", isAuth, getInvoice);

router.get("/checkout", isAuth, getCheckout);

export default router;
