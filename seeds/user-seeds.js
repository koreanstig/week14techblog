const { User } = require('../models');

const userData = [{
        username: 'David',
        password: 'forgetmenot'

    }
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;