import { Router } from 'express';
import { middlewareAdapter, MvcController, routeMvcAdapter, TypeActionMvc } from '../../../../core/presentation';
import { UserRepository } from '../../infra';
import { UserController } from '../controllers';
import { UserIdMiddleware, UserUsernameMiddleware, UserPasswordMiddleware, UserCreateMiddleware, UserLoginMiddleware } from '../middlewares';

const makeControler = (): MvcController => { // factory Method
    const repository  =new UserRepository();
    return new UserController(repository);
}

export default class UserRoutes {
    public init(router: Router) {   

        router.post('/users', 
            middlewareAdapter(new UserIdMiddleware()), 
            middlewareAdapter(new UserUsernameMiddleware()), 
            middlewareAdapter(new UserPasswordMiddleware()), 
            middlewareAdapter(new UserCreateMiddleware()), routeMvcAdapter(makeControler(), TypeActionMvc.STORE));
        router.get('/users', routeMvcAdapter(makeControler(), TypeActionMvc.INDEX));
        router.get('/users/:id', 
            middlewareAdapter(new UserIdMiddleware()), routeMvcAdapter(makeControler(), TypeActionMvc.SHOW));
        router.put('/users/:id', 
            middlewareAdapter(new UserIdMiddleware()), 
            middlewareAdapter(new UserPasswordMiddleware()), routeMvcAdapter(makeControler(), TypeActionMvc.UPDATE));
        router.delete('/users/:id', middlewareAdapter(new UserIdMiddleware()), routeMvcAdapter(makeControler(), TypeActionMvc.DELETE));
        router.post('/users/login', 
            middlewareAdapter(new UserUsernameMiddleware()), 
            middlewareAdapter(new UserPasswordMiddleware()),
            middlewareAdapter(new UserLoginMiddleware()), routeMvcAdapter(makeControler(),  TypeActionMvc.LOGIN));
    };
};