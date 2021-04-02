const router = require("express").Router();
const { User, Post, Comment} = require("../models");
const sequelize = require("../config/connection");

router.get('/', (req, res) => {
    Post.findAll({
            attributes: [ 'id', 'title', 'content', 'created_at'],
            include: [{
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
        }).then(dbPostData => {

            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('home', { posts, loggedIn: req.session.loggedIn });

        }).catch(err => {

            console.log(err);
            res.status(500).json(err);

        });
});

router.get("/viewpost/:id", (req, res) => {
   
    Post.findOne({
            where: {id: req.params.id},
            attributes: [
                'id',
                'content',
                'title',
                'created_at'
            ],
            include: [{
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        }).then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            const post = dbPostData.get({ plain: true });
            console.log(post);
            res.render('single-post', { post, loggedIn: req.session.loggedIn });


        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.get("/dashboard", (req, res) => {
   
    console.log(req.session.user_id, " this is the session id");
    Post.findAll({
            where: {
                user_id: req.session.user_id,
            },
            attributes: ["id", "title", "body", "user_id"],
            include: [{
                    model: User,
                    as: "user",
                    attributes: ["username"],
                },
                {
                    model: Comment,
                    as: "comments",
                    attributes: ["id", "comment_text", "user_id"],
                    include: [{
                        model: User,
                        as: "user",
                        attributes: ["username"],
                    }, ],
                },
            ],
        }).then((dbPostData) => {
         
            if (!dbPostData) {
                res.status(404).json({
                    message: "No Posts Available"
                });
                return;
            }
            const posts = dbPostData.map((post) => post.get({
                plain: true
            })); 

            console.log(posts);
            res.render("dashboard", {
                posts,
                loggedIn: req.session.loggedIn
            });
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get("/post", (req, res) => {
    res.render("create-post", {
        loggedIn: req.session.loggedIn
    });
});

router.get("/edit/:id", (req, res) => {
   
    res.render("edit-post", {
        loggedIn: req.session.loggedIn,
        post_id: req.params.id,
    });
});

module.exports = router;