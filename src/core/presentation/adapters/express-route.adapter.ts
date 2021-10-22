import { Request, Response } from "express";
import { TypeActionMvc, HttpRequest, HttpResponse, MvcController } from "../";

export const routeAdapter = () => {};

//Adapter do express com padrão MVC
export const routeMvcAdapter = (
    controller: MvcController, 
    typeAction: TypeActionMvc
    ) => {
        return async(req: Request, res: Response) => {
            const httpRequest: HttpRequest = {
                body: req.body,
                params: req.params,
            };
            let httpResponse: HttpResponse;

            switch (typeAction) {
                case TypeActionMvc.STORE: 
                    httpResponse = await controller.store(httpRequest);
                break;
                case TypeActionMvc.UPDATE: 
                    httpResponse = await controller.update(httpRequest);
                break;
                case TypeActionMvc.DELETE: 
                    httpResponse = await controller.delete(httpRequest);
                break;
                case TypeActionMvc.INDEX: 
                    httpResponse = await controller.index(httpRequest);
                break;
                case TypeActionMvc.SHOW: 
                    httpResponse = await controller.show(httpRequest);
                break;
                case TypeActionMvc.LOGIN: 
                    httpResponse = await controller.login(httpRequest);
                break;
            }

            //validação
            if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
                return res.status(httpResponse.statusCode).json(httpResponse.body);
            } else {
                return res.status(httpResponse.statusCode).json({
                    error: httpResponse.body.message,
                });
            };
            
        };
    };