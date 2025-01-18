const express = require('express');
const { User } = require('../db');
const z = require('zod');
const jwt = require('jsonwebtoken');
const JWT_SECRET= require('./config');
const { Todo } = require('../db');
const authMiddleware = require('./authmiddleware');

const router = express.Router();
const signupschema = z.object({
    username: z.string().min(5, "Username should be at least 5 characters long"),
    password: z.string().min(4, "Password should be at least 4 characters long"),
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
});

router.post('/signup', async (req, res) => {
    try {
        const validationResult = signupschema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                msg: "Validation failed. Please try again.",
                errors: validationResult.error.errors,
            });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(409).json({
                message: "Username is already taken",
            });
        }

        // Create a new user document with the necessary fields
        const dbUser = new User({
            username: req.body.username,
            password: req.body.password, // Make sure to hash the password before saving in a real app
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        });

        // Save the user document in the database
        await dbUser.save();

        // Create a JWT token for the new user using MongoDB's default _id field
        const token = jwt.sign({ userid: dbUser._id }, JWT_SECRET, { expiresIn: '1h' });

        // Respond with success and the token
        res.status(201).json({
            message: "User created successfully",
            token: token,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred during signup",
            error: error.message,  
        });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userid: user._id }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            msg: "Sign in successful",
            token: token,
        });
    } catch (error) {
      
        res.status(500).json({
            message: "An error occurred during sign-in",
        });
    }
});

router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        console.log("Authenticated User:", req.user); // Debugging user
        const userId = req.user.userid;

        const newtodo = new Todo({
            title,
            description,
            userId,
        });

        await newtodo.save();
        res.status(201).json({ message: "Todo created successfully", todo: newtodo });
    } catch (error) {
        console.error("Error creating Todo:", error.stack); // Log the exact error stack
        res.status(500).json({ message: 'Error creating Todo', error: error.message });
    }
});


router.get("/todos", authMiddleware, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.userid });
        res.status(200).json({ todos });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Todos', error: error.message });
    }
});
router.put("/todos/:id",authMiddleware,async(req,res)=>{
    const {id}=req.params;
    const {title,description}=req.body;
    if(!title || !description){
        res.status(400).json({message:"title and description are requried"})
    };
    const todo=await Todo.findOne({ _id: id, userId: req.user.userid });
    if(!todo){
        res.status(404).json({message:"Invalid user id"})
    }
    todo.title=title;
    todo.description=description;
    await todo.save();
    res.status(200).json({
        message: 'Todo updated successfully',
        todo: todo,
    });
})
router.delete("/todos/:id",authMiddleware,async(req,res)=>{
    const {id}=req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user.userid });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found or unauthorized action" });
        }

        res.status(200).json({
            message: "Todo deleted successfully",
            todo: todo,
        });
})
router.put("/todos/completed/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    try {
        // Validate input
        if (typeof completed !== 'boolean') {
            return res.status(400).json({ message: 'Invalid completed status.' });
        }

        // Update the todo item in the database
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { completed },
            { new: true } // Return the updated document
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found.' });
        }

        // Respond with the updated todo
        res.status(200).json({ message: 'Todo updated successfully.', todo: updatedTodo });
    } catch (error) {
       
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
