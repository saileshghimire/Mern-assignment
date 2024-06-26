const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin,Course } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config")

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    await Admin.create({
        username: username,
        password:password
    });
    res.status(200).json({ message: 'Admin created successfully' })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    try{
        const user = await Admin.findOne({
            username:username,
            password:password
        });
        if (user){
            const token = jwt.sign({username}, JWT_SECRET);
            res.json({token});
        }

    } catch(err){
        res.status(411).json({error:err});
    } 
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;
    const newcourse = await Course.create({
        title,
        description,
        imageLink,
        price
    });
    res.json({ message: 'Course created successfully', courseId: newcourse._id });
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const response = await Course.find({});
    res.json({
        courses: response
    });
});

module.exports = router;