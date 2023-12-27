var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/addFriend', async (req, res) => {
  try {
    const { currentUserId, friendIdToAdd } = req.body;

    // Find the current user
    const currentUser = await User.findById(currentUserId);

    // Check if the friend is not already in the friends list
    if (!currentUser.friends.includes(friendIdToAdd)) {
      // Add the friend to the friends list
      currentUser.friends.push(friendIdToAdd);

      // Save the updated user document
      const updatedUser = await currentUser.save();

      res.status(200).json({ message: 'Friend added successfully', user: updatedUser });
    } else {
      res.status(400).json({ message: 'Friend already added' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
