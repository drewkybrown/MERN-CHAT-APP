const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");
const requireAuth = require("../middleware/requireAuth");

router.post("/send-message", (req, res) => {
  console.log("Received a send-message request"); // Debugging log
  ChatController.sendMessage(req, res);
});

// Modify the route to include the userId parameter
router.get("/get-messages/:userId", (req, res) => {
  console.log("Received a get-messages request"); // Debugging log
  ChatController.getMessages(req, res);
});

module.exports = router;
