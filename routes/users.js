const express = require('express');
const router = express.Router();
const User = require("../models/User");
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//getAllMyFriendList
router.get('/water-streak-friends', async (req, res) => {
  try {
    const userId = req.query.userId;
    const users = await User.findById(userId).select('friends')

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    let friendsDetails = [];
    for (let key in users.friends) {
      let friendId = users.friends[key];
      const friendDetail = await User.findById(friendId).select('_id name waterStreak userImg');
      if (friendDetail) { // Make sure the friend was found
        friendsDetails.push(friendDetail);
      }
    }

    res.status(200).json(friendsDetails);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.get('/food-streak-friends', async (req, res) => {
  try {
    const userId = req.query.userId;
    const users = await User.findById(userId).select('friends')

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    let friendsDetails = [];
    for (let key in users.friends) {
      let friendId = users.friends[key];
      const friendDetail = await User.findById(friendId).select('_id name foodStreak userImg');
      if (friendDetail) { // Make sure the friend was found
        friendsDetails.push(friendDetail);
      }
    }

    res.status(200).json(friendsDetails);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.get('/friends/:name', async (req, res) => {
  try {
    const { name } = req.params;

    // Find users by name
    const users = await User.find({ name: new RegExp(name, 'i') }).select('_id name userImg');

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.post('/add-friend', async (req, res) => {
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
