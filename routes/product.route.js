import { Router } from "express";
const router = Router();
import {
  addProduct,
  getProducts,
  getProductById,
  getProductsByMostReviewed,
  getProductsByTopRatings,
  addRatingToProduct,
  addReviewToProduct,
  getNewProducts,
  searchProducts,
  addVariant,
} from "../controllers/product.controller.js";


router.post("/", addProduct);
router.get("/all", getProducts);
router.get("/", getProductById);
router.post("/rate/:productId", addRatingToProduct);
router.post("/review/:productId", addReviewToProduct);
router.get("/mostReviewed", getProductsByMostReviewed);
router.get("/topRated", getProductsByTopRatings);
// /new-arrival?limit=10000
router.get("/new-arrival", getNewProducts);
// /search?query={query}
router.get("/search", searchProducts);
// /add-variant?productId
router.post('/add-variant', addVariant);
router.get('/test', (req,res)=> {
  res.status(200).json({success:"success"});
});

export default router;
