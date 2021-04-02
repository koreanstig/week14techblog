const { Post } = require('../models');

const postData = [{
        title: 'First comment',
        content: 'Hello, this is me making my first comment!',
        user_id: 1

    }
];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;