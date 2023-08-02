import { Request, Response } from "express";
import { AuthenticationLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import { default500Response } from "../Utils/DefaultResponses";
import UserDAO from "../DAO/UserDAO";

export async function checkEmailDisponibility(req: Request, res: Response){
    try{
        const userDAO = new UserDAO()
        const userData = await userDAO.getUserByField('email', req.body.email)
        res.status(200).send({
            isAvailable: userData === false
        })
    }catch(error: any){
        generateErrorLogFromRequest(AuthenticationLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export async function checkUserDisponibility(req: Request, res: Response){
    try{
        const userDAO = new UserDAO()
        const userData = await userDAO.getUserByField('username', req.body.username)
        res.status(200).send({
            isAvailable: userData === false
        })
    }catch(error: any){
        generateErrorLogFromRequest(AuthenticationLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}