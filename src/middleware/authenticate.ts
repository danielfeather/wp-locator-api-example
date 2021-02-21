import { NextFunction, Request, Response } from "express";
import * as jwksRsa from "jwks-rsa";
import * as jwt from "express-jwt";

export default function () {

    const secret = jwksRsa.expressJwtSecret({
        jwksUri: process.env['JWKS_URI'],
        cache: true,
        rateLimit: true
    })

    return jwt({
        secret: secret,
        audience: process.env['JWT_AUDIENCE'],
        issuer: process.env['JWT_ISSUER'],
        algorithms: process.env['JWT_ALGORITHMS'].split(' ')
    })

}