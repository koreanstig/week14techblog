const router = require("express").Router();
const {
    User,
    Post,
    Comment
} = require("../models");
const sequelize = require("../config/connection");

router.get("/", (req, res) => {
    Post.findAll({
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
                },
            ],
        })
        .then((dbPostData) => {
     
            if (!dbPostData) {
                res.status(404).json({
                    message: "No Posts Available"
                });
                return;
            }
            const posts = dbPostData.map((post) => post.get({
                plain: true
            })); 
            res.render("home", {
                posts,
                loggedIn: req.session.loggedIn
            });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});
router.get("/viewpost/:id", (req, res) => {

    Post.findOne({
            where: {
                id: req.params.id,
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
        })
        .then((dbPostData) => {
         
            if (!dbPostData) {
                res.status(404).json({
                    message: "No Posts Available"
                });
                return;
            }
            const post = dbPostData.get({
                plain: true
            }); 
            const myPost = post.user_id == req.session.user_id;
            res.render("single-post", {
                post,
                loggedIn: req.session.loggedIn,
                currentUser: myPost,
            });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.get("/login", (req, res) => {
    res.render("login", {
        loggedIn: req.session.loggedIn
    });
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
            res.render("dashboard", {
                posts,
                loggedIn: req.session.loggedIn
            });
        }).catch((err) => {
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