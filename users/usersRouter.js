const express = require('express');

//Data
const userDb = require('../data/helpers/userDb');

const router = express.Router();


const setToUpperCase = (req, res, next) => {
    req.body.name = req.body.name.toUpperCase();
    next();
}

//Users
router.get('/', (req, res) => {
  userDb.get()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(error => {
        res.status(500).json({message: error})
    })
});

//User By Id
router.get('/:id', (req, res) => {
    const { id } = req.params;

    userDb.get(id)
        .then( user => {
            console.log('Get User by ID', user);
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ message: 'User Not Found'})
            }
        })
        .catch(error => {
            res.status(500).json({ message: error})
        })
});

//Users Posts
router.get('/:id/posts', (req, res) => {
    const { id } = req.params;

    userDb.getUserPosts(id)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({message: error})
        })
});

//Create New User
router.post('/', setToUpperCase, (req, res) => {
    const user = req.body;
    const { name } = user;
    console.log('Post req.body:', user);

    if(!name) {
        res.status(400).json({message: "Name Required"})
    }

    userDb.insert(user)
        .then(newUser => {
            res.status(201).json(newUser);
        })
        .catch(error => {
            res.status(500).json({ message: error})
        })
});

//Update Existing User
router.put('/:id', setToUpperCase, (req, res) => {
    const { id } = req.params;
    const user = req.body;

    userDb.update(id, user)
        .then(count => {
            if(count) {
                res.status(200).json({ message: `${count} Uer updated`})
            } else {
                res.status(404).json({ message: 'User ID does not exist'})
            }
        })
        .catch(error => {
            res.status(500).json({ message: error})
        })
});

// Delete User
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    userDb.remove(id)
        .then(count => {
            if (count) {
                res.status(200).json({ message: `${count} User delete`})
            } else {
                res.status(404).json({ message: 'User ID does not exist'})
            }
        })
        .catch(error => {
            res.status(500).json({ message: error })
        })
});

module.exports = router;