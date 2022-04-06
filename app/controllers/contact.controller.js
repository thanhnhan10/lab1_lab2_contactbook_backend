// exports.create = (req, res) => {
//     res.send({ message: "create handler" });
// };

// exports.findAll = (req, res) => {
//     res.send({ message: "findAll handler" });
// };

// exports.findOne = (req, res) => {
//     res.send({ message: "findOne handler" });
// };

// exports.update = (req, res) => {
//     res.send({ message: "update handler" });
// };

// exports.delete = (req, res) => {
//     res.send({ message: "delete handler" });
// };

// exports.deleteAll = (req, res) => {
//     res.send({ message: "deleteAll handler" });
// };

// exports.findAllFavorite = (req, res) => {
//     res.send({ message: "findAllFavorite handler" });
// };

const mongoose = require('mongoose');
const { BadRequestError } = require('../errors');
const Contact = require("../models/contact.model");

exports.create = async(req, res, next) => {

    if (!req.body.name) {
        return next(new BadRequestError(404, "Name can not be empty"));
    }

    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        favorite: req.body.favorite === true,
    });

    try {
        const document = await contact.save();
        return res.send(document);
    } catch (error) {
        return next(
            new BadRequestError(
                500, "An error occurred while creating the contact"
            )
        );
    }
};

exports.findAll = async(req, res, next) => {

    const condition = {};
    const { name } = req.query;
    if (name) {
        condition.name = { $regex: new RegExp(name), $option: "i" };
    }

    try {
        const document = await Contact.find(condition);
        return res.send(document);
    } catch (error) {
        return next(
            new BadRequestError(
                500, "An error occurred while retrieving contact"
            )
        );
    }
};


exports.findOne = async(req, res, next) => {

    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await Contact.findOne(condition);
        if (!document) {
            return next(new BadRequestError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new BadRequestError(
                500, `Error retrieving contact with id = ${req.params.id}`
            )
        );
    }
};

exports.update = async(req, res, next) => {

    if (Object.keys(req.body).length === 0) {
        return next(
            new BadRequestError(400, "Data to update can not be empty"));
    }

    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await Contact.findOneAndUpdate(condition, req.body, {
            new: true,
        });
        if (!document) {
            return next(new BadRequestError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated successfully" });
    } catch (error) {
        return next(
            new BadRequestError(
                500, `Error updating contact with id=${req.params.id}`
            )
        );
    }
};


exports.delete = async(req, res, next) => {

    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };


    try {
        const document = await Contact.findOneAndDelete(condition);
        if (!document) {
            return next(new BadRequestError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was deleted successfully", });
    } catch (error) {
        return next(
            new BadRequestError(
                500, `Could not delete contact with id=${req.params.id}`
            )
        );
    }
};


exports.findAllFavorite = async(req, res, next) => {

    try {
        const documents = await Contact.find({ favorite: true });
        return res.send(documents);
    } catch (error) {
        return next(
            new BadRequestError(
                500, "An error occurred while retrieving favorite contacts"
            )
        );
    }
};

exports.deleteAll = async(req, res, next) => {

    try {
        const data = await Contact.deleteMany({});
        return res.send({
            message: `${data.deletedCount} contacts was deleted successfully`
        });
    } catch (error) {
        return next(
            new BadRequestError(
                500, `An error occurred while removing all contacts`
            )
        );
    }
};