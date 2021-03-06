const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const queryGenerator = require("../db/queryHelpers");
  const interviewQueryGenerator = require("../db/queryHelpers/interview");
  const { sendInterviewInvitation, responseToInterviewInvitation } =
    interviewQueryGenerator(db);
  const { getMessagesByUserId, createNewMessage, readMessages } =
    queryGenerator(db);

  //Get All Messages for users
  router.get("/", async (req, res) => {
    try {
      const { user_id } = req.session;
      const data = await getMessagesByUserId(user_id);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  });

  router.post("/", async (req, res) => {
    try {
      const newMessage = await createNewMessage(req.body);
      res.status(200).json(newMessage);
    } catch (error) {
      console.log(error);
    }
  });

  router.post("/interview", async (req, res) => {
    const { user_id } = req.session;
    const { start, end, applicationId, receiverId, message, created_at } = req.body;

    try {
      const data = await sendInterviewInvitation(
        start,
        end,
        user_id,
        receiverId,
        applicationId,
        message,
        created_at
      );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  });

  router.put("/interview", async (req, res) => {
    const {
      id,
      application_id,
      start_time,
      end_time,
      interviewer_id,
      is_accepted,
      message,
    } = req.body;

    const newMessage = (is_accepted ? "[ACCEPTED] " : "[REJECTED] ") + message;
    try {
      const data = await responseToInterviewInvitation(
        id,
        application_id,
        start_time,
        end_time,
        interviewer_id,
        is_accepted,
        newMessage
      );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  });

  router.put("/read/:id", async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.session;

    try {
      const data = await readMessages(id, user_id);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  });

  return router;
};
