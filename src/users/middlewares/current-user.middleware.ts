import { Injectable, NestMiddleware } from "@nestjs/common";
import { UsersService } from "../users.service";
import { Request, Response, NextFunction } from "express";
import { User } from "../user.entity";

declare global{
    namespace Express {
        interface Request{
            CurrentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{
    constructor(private userService: UsersService){}

    async use(req: Request, res: Response, next: NextFunction){
        const { userId } = req.session || {};
        if(userId){
            const user= await this.userService.findOne(userId);
            req.CurrentUser= user;            
        } 
        next();
    }
}