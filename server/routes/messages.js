const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const queryGenerator = require("../db/queryHelpers");
  const { getMessagesByUserId, createNewMessage } = queryGenerator(db);
  //Get All Messages for users
  router.get("/", async(req,res) => {
    try {
      const { user_id } = req.session;
      const messages = await getMessagesByUserId(user_id);
      res.status(200).json(messages);
    } catch (error) {
      console.log(error);
    }
  });

  router.post("/", async(req,res) => {
    try {
      const newMessage =  await createNewMessage(req.body);
      res.status(200).json(newMessage);
    } catch (error) {
      console.log(error);
    }
  })

  return router;
}