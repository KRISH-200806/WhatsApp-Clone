const express = require("express");
const { getUsersForSidebar, sendMessage, getMessages } = require("../controller/message.controller");
const protectRoute = require("../middleware/secure.middleware");



const messagerouter = express.Router();

messagerouter.get("/users",protectRoute,getUsersForSidebar)
messagerouter.post("/send/:id", protectRoute, sendMessage);
messagerouter.get("/get/:id", protectRoute, getMessages);

module.exports = messagerouter;
