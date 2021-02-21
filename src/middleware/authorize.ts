import { NextFunction, Request, Response } from "express";

export default function (scopes: string[]) {

    return (req: Request, res: Response, next: NextFunction) => {

        const token: any = req.user;

        const tokenScopes = token.scope.split(' ');

        if (!tokenScopes.some( (scope: string) => scopes.indexOf(scope) > -1) ){
            res.status(403);
            res.end();
            return;
        }

        next()

    }

}