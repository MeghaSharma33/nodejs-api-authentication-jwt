const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation,loginValidation} = require('../validation');

router.post('/register',async (req,res) => {
    //validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //checking if exists
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Already exists')

    //hash a password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const SavedUser = await user.save();
        res.send({user : user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

    //Login
router.post('/login',async (req,res) => {
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
          
            const user = await User.findOne({email: req.body.email});
            if(!user) return res.status(400).send('Doesnt exist');


            const validPass = await bcrypt.compare(req.body.password, user.password);
            if(!validPass) return res.status(400).send('Invalid password');

            const token = jwt.sign({_id : user._id}, process.env.TOKEN_SECRET);
            res.header('auth-token', token).send(token);

           res.send('Logged In'); 
})

    

module.exports = router;