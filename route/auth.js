const router = require('express').Router();
const User = require('../model/User');

const Joi = require('@hapi/joi');

const schema =Joi.object({
    name : Joi.string().min(6).required(),
    email : Joi.string().min(5).required().email(),
    password: Joi.string().min(6).required()
}

)
router.post('/register',async (req,res) => {

    //validation
    const { error }= schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
 
    //checking if exists
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Already exists')

    const user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    try{
        const SavedUser = await user.save();
        res.send(SavedUser);
    }catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;