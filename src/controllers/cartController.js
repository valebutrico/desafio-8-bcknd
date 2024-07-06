import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

const createCart = async (req, res) => {
  try {
    const cart = new Cart({ products: [] });
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    let productInCart = cart.products.find((p) => p.productId.equals(pid));
    if (productInCart) {
      if (productInCart.quantity > 1) {
        productInCart.quantity -= 1;
      } else {
        cart.products = cart.products.filter((p) => !p.productId.equals(pid));
      }
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Product not in cart" });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    await Cart.findByIdAndUpdate(cid, { products });
    res.json({ status: "success", message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const updateProductQuantityInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    await Cart.updateOne(
      { _id: cid, "products.productId": pid },
      { $set: { "products.$.quantity": quantity } }
    );
    res.json({ status: "success", message: "Product quantity updated" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const deleteAllProductsFromCart = async (req, res) => {
  try {
    const { cid } = req.params;
    await Cart.findByIdAndUpdate(cid, { products: [] });
    res.json({ status: "success", message: "All products removed from cart" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.productId");
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    const product = await Product.findById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    let productInCart = cart.products.find((p) => p.productId.equals(pid));
    if (productInCart) {
      if (productInCart.quantity < product.stock) {
        productInCart.quantity += 1;
      } else {
        return res
          .status(400)
          .json({ status: "error", message: "Not enough stock" });
      }
    } else {
      cart.products.push({ productId: pid, quantity: 1 });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export {
  createCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantityInCart,
  deleteAllProductsFromCart,
  getCartById,
  addProductToCart,
};