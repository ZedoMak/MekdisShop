const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);


router.route('/').post(protect, admin, upload.single('image'), createProduct);
router.route('/:id').put(protect, admin, upload.single('image'), updateProduct);
router.route('/:id').delete(protect, admin, deleteProduct);

module.exports = router;  

