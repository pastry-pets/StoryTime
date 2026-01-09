
const express = require('express');
const router = express.Router();

const { Story } = require('../database/index')


const findFullStory = (storyObj) => {
  console.log(storyObj);
};

router.get('/all', (req, res) => {
  
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  Story.findOne({ where: { id }})
    .then(storyObj => {
      if (storyObj) {
        const fullStory = findFullStory(storyObj);
        res.status(200).send(fullStory);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      console.error('Unable to retrieve story on server: ', err);
      req.sendStatus(500);
    });
});

module.exports = router;
