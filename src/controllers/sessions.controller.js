import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

// Opciones de cookies seguras
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000 // 1 hora
};

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        const exists = await usersService.getUserByEmail(email);
        if (exists) {
            return res.status(400).send({ status: "error", error: "User already exists" });
        }
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send({ status: "error", error: "Error al crear usuario" });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        const user = await usersService.getUserByEmail(email);
        if(!user) {
            return res.status(404).send({status:"error",error:"User doesn't exist"});
        }
        const isValidPassword = await passwordValidation(user,password);
        if(!isValidPassword) {
            return res.status(400).send({status:"error",error:"Incorrect password"});
        }
        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, JWT_SECRET, {expiresIn:"1h"});
        res.cookie('coderCookie', token, cookieOptions).send({status:"success",message:"Logged in"});
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).send({ status: "error", error: "Error al iniciar sesión" });
    }
}

const current = async(req,res) =>{
    try {
        const cookie = req.cookies['coderCookie'];
        if (!cookie) {
            return res.status(401).send({status:"error",error:"No authentication token"});
        }
        const user = jwt.verify(cookie, JWT_SECRET);
        res.send({status:"success",payload:user});
    } catch (error) {
        console.error('Error en current:', error);
        res.status(401).send({status:"error",error:"Token inválido o expirado"});
    }
}

const unprotectedLogin = async(req,res) =>{
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        const user = await usersService.getUserByEmail(email);
        if(!user) {
            return res.status(404).send({status:"error",error:"User doesn't exist"});
        }
        const isValidPassword = await passwordValidation(user,password);
        if(!isValidPassword) {
            return res.status(400).send({status:"error",error:"Incorrect password"});
        }
        const token = jwt.sign(user.toObject(), JWT_SECRET, {expiresIn:"1h"});
        res.cookie('unprotectedCookie', token, cookieOptions).send({status:"success",message:"Unprotected Logged in"});
    } catch (error) {
        console.error('Error en unprotectedLogin:', error);
        res.status(500).send({ status: "error", error: "Error al iniciar sesión" });
    }
}

const unprotectedCurrent = async(req,res)=>{
    try {
        const cookie = req.cookies['unprotectedCookie'];
        if (!cookie) {
            return res.status(401).send({status:"error",error:"No authentication token"});
        }
        const user = jwt.verify(cookie, JWT_SECRET);
        res.send({status:"success",payload:user});
    } catch (error) {
        console.error('Error en unprotectedCurrent:', error);
        res.status(401).send({status:"error",error:"Token inválido o expirado"});
    }
}

export default {
    register,
    login,
    current,
    unprotectedLogin,
    unprotectedCurrent
}