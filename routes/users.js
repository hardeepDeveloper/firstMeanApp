const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const passport = require('passport');
const bcrypt = require('bcryptjs');

// Load User Model
require('../models/user');
const User = mongoose.model('user');

// User Login Page
router.get('/login', (req, res)=>{
    res.render('users/login');
});

// User Login Page
router.get('/register', (req, res)=>{
    res.render('users/register');
});

// Post Routes
router.post('/register', (req, res)=>{
    let errors = [];

    if(req.body.password !== req.body.password2 ){
        errors.push({text: 'Passwords do not match'});
    }

    if(req.body.password.length < 4 ){
        errors.push({text: 'Passwords must be atleast 4 characters'});
    }

    if(errors.length > 0){
        res.render('users/register',{
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,
        })
    } else {

        User.findOne({email: req.body.email})
            .then(user=>{
                if(user){
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('/users/register');
                } else {
                    const newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                    }
            
                    bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if(err) throw err;
                            newUser.password = hash;
            
                            new User(newUser)
                                .save()
                                .then(user=>{
                                    req.flash('success_msg','You are now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch((err)=>{
                                    console.log(err);
                                    return;
                                });
                        });
                    });
            
                }
            })
        
        
       
    }

});

module.exports = router;