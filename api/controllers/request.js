const mongoose = require("mongoose");
const requestModel = require("../models/requests");
const toImgUrl = require('../utils/index')

//create one 

exports.createRequest = async (req, res, next) => {

    if (!req.files)
        return res.status(422).json({ message: 'images is required' });

    let len = req.files.length;
    req.body.img = [];


    for (let i = 0; i < len; i++) {
        req.body.img.push(await toImgUrl.toImgUrl(req.files[i]));
    }
    req.body.date = new Date(parseInt(req.body.date));
    req.body.user = req.userData.userId;
    let createdObj = await requestModel.create(req.body);

    return res.status(200).json(createdObj);

};
exports.getAllforAdmin = async (req, res, next) => {
    if (req.userData.type == 'ADMIN') {
        let details = await requestModel.find().populate('user').populate('doner');
        return res.status(200).json(details);
    }else{
        return res.status(403).json({ error: 'not admin' })
    }

};

//get All 

exports.getAll = async (req, res, next) => {
    let details = await requestModel.find({ status: 'Accepted' }).populate('user').populate('doner');
    let arr;
    let going = false;

    for (let i = 0; i < details.length; i++) {

        arr = details[i].doner;

        for (let j = 0; j < arr.length; j++) {
            if (arr[j].id == req.userData.userId) {
                console.log('hello')
                going = true;

            }
            else {
                going = false;

            }
        }
        details[i] = { ...details[i].toJSON(), going };


    }
    return res.status(200).json(details);

};

//getOne Request by user
exports.getOne = async (req, res, next) => {
    const id = req.params.reqId;
    let details = await requestModel.findById(id).populate('user').populate('doner');


    if (!details)
        return res.status(404).end();
    let arr;
    let going = false;
    arr = details.doner;

    for (let j = 0; j < arr; j++) {
        if (arr[j].id == req.userData.userId) {
            console.log('hello')
            going = true;
        }
        else {
            going = false;
        }
    }
    details = { ...details.toJSON(), going };


    return res.status(200).json(details);

};


//Update By Admin 

exports.updateAccepted = async (req, res, next) => {

    if (req.userData.type == 'ADMIN') {
        const id = req.params.reqId;
        let old = await requestModel.findById(id);

        if (!old)
            return res.status(404).end();
        try {
            old.status = 'Accepted';
            await old.save();

            let newObject = await requestModel.findById(id).populate('user').populate('doner')
            return res.status(200).json(newObject)

        } catch (error) {
            return res.status(500).json({
                "message": "updating process not completed",
                error: err
            });
        }
    } else {
        return res.status(403).json({ error: 'not admin' })
    }

};

//update to rejected request
exports.updateRejected = async (req, res, next) => {

    if (req.userData.type == 'ADMIN') {
        const id = req.params.reqId;
        let old = await requestModel.findById(id);

        if (!old)
            return res.status(404).end();
        try {
            old.status = 'Rejected';
            await old.save();

            let newObject = await requestModel.findById(id).populate('user').populate('doner')
            return res.status(200).json(newObject)

        } catch (error) {
            return res.status(500).json({
                "message": "updating process not completed",
                error: err
            });
        }
    } else {
        return res.status(403).json({ error: 'not admin' })
    }

};


//update to donation 

exports.updateDonate = async (req, res, next) => {

    const id = req.params.reqId;
    let old = await requestModel.findById(id);

    if (!old)
        return res.status(404).end();

    let allDonner = old.doner;
    try {
        allDonner.push(req.userData.userId);
        old.doner = allDonner;
        await old.save();

        let newObject = await requestModel.findById(id)
        let going = true;
        newObject = { ...newObject.toJSON(), going }
        return res.status(200).json(newObject)

    } catch (error) {
        return res.status(500).json({
            "message": "updating process not completed",
            error: err
        });
    }

};

//Get History of Donation 
exports.getAllIDonate = async (req, res, next) => {
    let details = await requestModel.find({ status: 'Accepted', doner: req.userData.userId }).populate('user').populate('doner');
    let going = true;

    for (let i = 0; i < details.length; i++) {
        details[i] = { ...details[i].toJSON(), going };
    }

    return res.status(200).json(details);

};

//Get All I request to Help
exports.getAllIRequest = async (req, res, next) => {
    let details = await requestModel.find({ status: 'Accepted', user: req.userData.userId }).populate('user').populate('doner');

    return res.status(200).json(details);

};



