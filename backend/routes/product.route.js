import express from "express"

import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFeaturedProducts,
    getRecommendation,
    getProductsByCategory,
    toggleFeatureproduct
} from "../controllers/product.controller.js"

import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()


router.get("/", protectRoute, adminRoute, getAllProducts)
router.get("/featured", getFeaturedProducts)
router.get("/category/:category", getProductsByCategory)
router.get("/recommendation", getRecommendation)
router.post("/", protectRoute, adminRoute, createProduct)
router.delete("/:id", protectRoute, adminRoute, deleteProduct)
router.patch("/:id", protectRoute, adminRoute, toggleFeatureproduct)

export default router;