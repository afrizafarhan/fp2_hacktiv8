const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class UserController {

    static async registerUser(req, res){
        try {
            const InputUsers = await User.create(req.body);
            const dataView = {
                email: InputUsers.email,
                full_name: InputUsers.full_name,
                username: InputUsers.username,
                profile_image_url: InputUsers.profile_image_url,
                age: InputUsers.age,
                phone_number: InputUsers.phone_number,
            }
            res.status(201).json({user : dataView});
        } catch (error) {
            res.status(500).json({error:error.errors[0].message});
        }
    }

    static async loginUser(req, res) {
        try {
            const data = await User.findOne({
                where: {
                    email: req.body.email,
                },
            });

            if (!data) {
                res.status(400).json({
                    error: "Email Is Incorrect",
                });
            } else {
                if (comparePassword(req.body.password, data.password)) {
                    const access_token = signToken({
                        id: data.id,
                        email: data.email,
                        username: data.username,
                    });
                    res.status(200).json({ token : access_token });
                } else {
                    res.status(400).json({
                        error: "Password Is Incorrect",
                    });
                }
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }

    static async getUserById(req, res){
        try {
            const userId = req.params.userId
            const data = await User.findByPk(userId);
            if (!data) {
                res.status(400).json({
                    error: "User not found..!",
                });
            }else {
                const dataView = {
                    email: data.email,
                    full_name: data.full_name,
                    username: data.username,
                    profile_image_url: data.profile_image_url,
                    age: data.age,
                    phone_number: data.phone_number,
                }
                res.status(200).json({user : dataView});
            }
        } catch (error) {
            res.status(500).json({message:error.message});
        }
        
    }

    static async delUser(req, res){
        try {
            const userId = req.params.userId
            User.destroy({
                where: {
                    id: userId
                },
            });
            res.status(200).json({message : "Your account has been successfully deleted"});
        } catch (error) {
            res.status(500).json({message:error.message});
        }
    }

}

module.exports = UserController;