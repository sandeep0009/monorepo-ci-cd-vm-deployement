import express, { type Request, type Response } from "express";
import {clientPrisma} from "db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const app=express();

app.use(express.json());

const port=8000;

app.get('/', async (_req: Request, res: Response) => {
    try {
        const users = await clientPrisma.user.findMany();
        if (!users || users.length === 0) {
            res.json({
                message: 'No users found'
            });
        }
         res.json({
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});


app.post('/create',async(req:Request,res:Response)=>{
    try {
        const {name , email ,password}=req.body;
        const userExist=await clientPrisma.user.findUnique({
            where:{
                email:email
            }
        });
        if(userExist){
            res.status(400).json({
                message: 'User already exists'
            });
            return;
        }

        const hashPassword=await bcrypt.hash(password,10);

        const createUser=await clientPrisma.user.create({
            data:{
                name:name,
                email:email,
                password:hashPassword
            }
        });
        res.json({
            message: 'User created successfully',
            user: createUser
        });
        
    } catch (error) {
        console.log(error)
        
    }
});

app.post('/login',async(req:Request,res:Response)=>{
    try {
        const {email,password}=req.body;
        const userExist=await clientPrisma.user.findUnique({
            where:{
                email:email
            }
        });
        if(!userExist){
            res.status(400).json({
                message: 'Invalid credentials'
            });
            return;
        }
        const isPasswordValid=await bcrypt.compare(password,userExist.password);
        if(!isPasswordValid){
            res.status(400).json({
                message: 'Invalid credentials'
            });
            return;
        }
        const token=jwt.sign({
            id:userExist.id,
            email:userExist.email
        },'secret',{expiresIn:'1h'});
        res.json({
            message: 'Login successful',
            token: token
        });
    } catch (error) {
        console.log(error)
        
    }
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});