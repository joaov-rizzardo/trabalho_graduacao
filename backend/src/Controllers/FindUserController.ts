import { Request, Response } from "express";
import { AuthenticationLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import { default500Response } from "../Utils/DefaultResponses";
import UserDAO from "../DAO/UserDAO";

export default async function findUserByEmailOrUsername(req: Request, res: Response){
    try{
        const userDAO = new UserDAO()
        let user = await userDAO.getUserByField('email', req.body.userInfo)
        if(user !== false){
            return res.status(200).send({
                userId: user.userId
            })
        }
        user = await userDAO.getUserByField('username', req.body.userInfo)
        if(user !== false){
            return res.status(200).send({
                userId: user.userId
            })
        }
        return res.status(200).send({
            userId: false
        })
    }catch(error: any){
        generateErrorLogFromRequest(AuthenticationLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}