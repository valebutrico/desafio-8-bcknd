import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";

const renderProductsPage = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = query
      ? { $or: [{ category: query }, { available: query === "true" }] }
      : {};
    const sortOption = sort ? { price: sort === "asc" ? 1 : -1 } : {};

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption,
    };

    const products = await Product.paginate(filter, options);
    res.render("products", {
      title: "Products",
      products: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/products?page=${products.prevPage}`
        : null,
      nextLink: products.hasNextPage
        ? `/products?page=${products.nextPage}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const renderCartPage = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.productId");
    if (!cart) {
      return res.status(404).render("error", { message: "Cart not found" });
    }
    res.render("cart", {
      title: "Cart",
      cart: cart.toObject(),
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export { renderProductsPage, renderCartPage };