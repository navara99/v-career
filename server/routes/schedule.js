const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const queryGenerator = require("../db/queryHelpers/schedule");
  const { getSchedule } = queryGenerator(db);

  router.get("/", async (req, res) => {
    const { user_id } = req.session;

    try {
      const events = await getSchedule(user_id);
      res.json(events);
    } catch (err) {
      console.log(err.message);
    }
  });

  return router;
};
