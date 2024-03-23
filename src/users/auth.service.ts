import { BadRequestException, ConsoleLogger, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService{
    constructor(private usersService: UsersService){}

    async signup(email: string, password: string){
        const users = await this.usersService.find(email);
        if(users.length > 0)throw new BadRequestException('Email already in use');

        // hash the user password
        // generate a salt
        const salt = randomBytes(8).toString('hex');

        // hash the salt and password 
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // joined the hashed result and the salt 
        const result = salt + "." + hash.toString('hex');

        // create a new user
        const user = await this.usersService.create(email, result);
        
        //return user
        return user;  
    }

    async signin(email: string, password: string){
        const [user] = await this.usersService.find(email);
        if(!user){
            throw new NotFoundException('User doesnot exist');
        }
        const [salt, storedHash] = user.password.split(".");

        const hash = (await scrypt(password, salt, 32)) as Buffer;
        if(storedHash !== hash.toString('hex')){
            throw new BadRequestException('Wrong Credentials');
        }
        return user;
    }
}