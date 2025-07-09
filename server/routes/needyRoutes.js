const express = require('express');
const router = express.Router();
const needyController = require('../controllers/needyController');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.put('/profile', auth, needyController.updateProfile);
router.put('/change-password', auth, needyController.changePassword);
router.post('/search', auth, upload.single('prescription'), needyController.uploadSearch);

module.exports = router;
