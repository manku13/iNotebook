const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator")
const bcrypt  =require('bcryptjs')
const jwt = require("jsonwebtoken")
const fetchuser = require("../Middleware/fetchuser")

const JWT_SECRET = 'MankuBossIsDon'

// Middleware to parse JSON bodies
router.use(express.json());

// Route 1: Endpoint to create a new user - Endpoint would be /api/auth/createuser
router.post("/createuser", [
    // setting validation-limit to different entries
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be five letters big").isLength({ min: 5 })
], async (req, res) => {
    let success = false
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success,
            errors: errors.array()
        })
    }
    try {
        //checking if user with pre-existing email exist or not
        let user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).json({success, error: "Sorry a user with this email already exist" }
        )
    }

    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash((req.body.password), salt)
    // if user doesn't exist then creating new user with pre-defined user-schema

    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email
    })
    var jwt = require('jsonwebtoken')

    const data = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    // res.json(user)
    success = true
    res.json({success, authtoken})
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Something Got wrong")
    }
    
})

// Route 2:
// router.post("/login", [
//     // Authenticate a User using : POST "api/auth/login"
//     body("email", "Enter a valid email").isEmail(),
//     body("password", "Password cannot be empty").exists()
// ], async (req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             errors: errors.array()
//         })
//     }

//     const {email, password} = req.body
//     let success = false
//     try {
//         let user = await User.findOne({email})
//         if(!user){
//             return res.status(400).json({success, error: "Please enter correct credentials to login"})
//         }
//         const passwordCompare = await bcrypt.compare(password, user.password)
//         if(!passwordCompare){
//             return res.status(400).json({success, error: "Please enter correct credentials to login"})
//         }
        
//         const data = {
//             user: {
//                 id: user.id
//             }
//         }
//         const authtoken = jwt.sign(data, JWT_SECRET)
//         success = true
//         res.json({success, authtoken})
//     } catch (error) {
//         console.error(error.message)
//         res.status(500).send(success, "Internal Server Error")
//     }
// })

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }
  
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken })
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });

// Route 3: Get loggedIn User Details using : POST "/api/auth/getuser"
router.post("/getuser", fetchuser, async (req,res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})
module.exports = router