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

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
});

module.exports = router;