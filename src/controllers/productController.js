import Product from "../models/productModel.js";

class ProductController {
  static async getProducts(req, res) {
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
        productos: products.docs,
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
        user: req.user,
      });
    } catch (error) {
      console.error("Error obteniendo productos:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async createProduct(req, res) {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creando producto:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

export default ProductController;