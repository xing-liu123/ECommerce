import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
    const {username, password} = req.body;

})
