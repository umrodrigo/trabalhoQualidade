import { NextFunction, Request, Response } from "express";
import { HttpRequest, HttpResponse, Middleware } from "..";

export const middlewareAdapter = (middleware: Middleware) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const httpRequest: HttpRequest = {
            body: req.body,
            headers: req.header,
            params: req.params,
        };
        const httpResponse: HttpResponse = await middleware.handle(httpRequest);

        if (httpResponse.statusCode === 200) { // caso mude helpers anlisar a regra, ou rota autenticada
            Object.assign(httpRequest, httpResponse.body);
            next();
        } else {
            res.status(httpResponse.statusCode).json({
                error: httpResponse.body.message,
            });
        };
    };
};