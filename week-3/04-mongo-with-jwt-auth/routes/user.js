const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User,Course } = require("../db")

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    await User.create({
        username,
        password
    });

    res.json({
        message: 'User created successfully'
    });
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    try{
        const user = await User.findOne({
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

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const response = await Course.find({});
    res.json({
        courses: response
    });
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    // form usermiddleware req.username contain username and pass into next function automatically
    const username = req.username;
    const courseId = req.body.courseId;
    try{
        await User.updateOne({
            username: username
        },{
            "$push":{
               purchasedCourses: courseId
            }
        })
        res.json({message:"purchase complete"});
    } catch(err){
        res.json({
            error:err
        });
    }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username:req.username
    })
    const courses = await Course.find({
        _id:{
            "$in": user.purchasedCourses
           }
    });
    res.json({
        courses:courses
    });
});

module.exports = router