const MessageModel = require("../model/message.model");
const UserModel = require("../model/user.model");
const { getReceiverSocketId, io } = require("../socket/server");


const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await UserModel.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

        const usersWithLastMessage = await Promise.all(
          users.map(async (user) => {
            const lastMessage = await MessageModel.findOne({
              $or: [
                { senderId: loggedInUserId, receiverId: user._id },
                { senderId: user._id, receiverId: loggedInUserId },
              ],
            })
              .sort({ updatedAt: -1 }) // Get the latest updated message
              .select("text updatedAt");

            return {
              ...user.toObject(),
              lastMessage: lastMessage || null,
            };
          })
        );

        // Sort users based on the latest message timestamp
        usersWithLastMessage.sort((a, b) => {
          if (!a.lastMessage) return 1; // Push users without messages to the bottom
          if (!b.lastMessage) return -1;
          return (
            new Date(b.lastMessage.updatedAt) -
            new Date(a.lastMessage.updatedAt)
          );
        });


    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(receiverSocketId).emit("updateSidebar", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUsersForSidebar, getMessages, sendMessage };
