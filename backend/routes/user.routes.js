const express = require("express")
const { signup, login, logout, checkAuth, updateProfile } = require("../controller/user.controller")
const protectRoute = require("../middleware/secure.middleware")



const router = express.Router()

router.post("/signup",signup)
router.post("/login", login)
router.post("/logout", logout)

router.get("/check", protectRoute, checkAuth);

router.put("/updateprofile", protectRoute, updateProfile);

module.exports=router