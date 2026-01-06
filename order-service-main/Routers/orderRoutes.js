const express = require("express");
const { addOrder,getOrderWithDetails ,getAllOrder,supprimerCommande,updateOrderStatusById} = require("../Controllers/CommandeController");
const {sendOtp,verifyOtp} = require('../Controllers/OtpController');



const router = express.Router();

router.post("/addOrder",addOrder);
router.get("/getOrderWithDetails/:userId",getOrderWithDetails);
router.get("/getAllOrder", getAllOrder);
router.post('/sendotp', sendOtp);
router.post('/verifyotp',verifyOtp);
router.delete('/supprimerCommande/:userId',supprimerCommande)
router.patch('/updateOrderStatusById/:id',updateOrderStatusById)


module.exports = router;
