const mongoose = require("mongoose");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {

      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        if (!req.body.phone.match(phoneno))
          return res.status(400).json({ message: "unValid Phone Number" });


        const newuser = new User({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
          password: req.body.password,
          gender:req.body.gender
        });
        newuser
          .save()
          .then(result => {
            //create token 
            let token = jwt.sign(
              {
                phone: result.phone,
                email: result.email,
                userId: result._id,
                type: result.type,
                gender:result.gender
              },
              'secret',
              {
                expiresIn: "4380h"

              }
            );

            console.log(result);
            res.status(201).send({
              message: "User created",
              user: newuser,
              token: token
            });
          })
          .catch(err => {
            next(err);
          });


      }
    });
};


//login

exports.user_login = (req, res, next) => {
  console.log(req.body.phone)
  User.findOne({ phone: req.body.phone, password: req.body.password })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).send({
          message: "Auth failed"
        });
      }
      else {
        const token = jwt.sign(
          {
            phone: user.phone,
            email: user.email,
            userId: user._id,
            type: user.type,
            gender:user.gender
          },
          'secret',
          {
            expiresIn: "4380h"
          }
        );
        return res.status(200).send({
          message: "Auth successful",
          token: token,
          user: user
        });
      }
      res.status(401).send({
        message: "Auth failed"
      });

    })
    .catch(err => {
      next(err);
    });
};


//get all users for Admin 

exports.getAll = async (req, res, next) => {
  if (req.userData.type == 'ADMIN') {
    let allUsers = await User.find();

    return res.status(200).json(allUsers);
  }
  else {
    return res.status(422).json({ message: 'not Adimn' });
  }

};
//get one user by admin 

exports.getOneByAdmin = async (req, res, next) => {

  if (req.userData.type == 'ADMIN') {
    let id = req.params.userId;

    let oneUser = await User.findById(id);

    if (!oneUser)
      return res.status(404).end();

    return res.status(200).json(oneUser);

  }
  else {
    return res.status(422).json({ message: 'not Adimn' });
  }


};



exports.getOne = async (req, res, next) => {
  console.log(req.userData);
  let id = req.userData.userId;

  let details = await User.findById(id);

  if (!details)
    return res.status(404).end();

  console.log(req.userData)

  return res.status(200).json(details);

};


exports.getCountOfAllUsers = async (req, res, next) => {
  if (req.userData.type == 'ADMIN') {
    let allUsershere = await User.find();

    return res.status(200).json({ count: allUsershere.length });
  }
  else {
    return res.status(403).send({ message: 'not an admin' });
  }


};