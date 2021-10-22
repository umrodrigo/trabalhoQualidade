import express, { Router } from "express";
import { request } from "http";
import { Request } from "supertest";
import { v4 as uuid } from "uuid";
import { UserEntity } from "../../../../../src/core/infra";
import Database from "../../../../../src/core/infra/data/connections/database";
import { App } from "../../../../../src/core/presentation";
import UserRoutes from "../../../../../src/features/users/presentation/routes/routes";

const makeUserDB = async (): Promise<UserEntity> =>
  UserEntity.create({
    username: "any_username",
    password: "any_password",
}).save();

const makeUsersDB = async (): Promise<UserEntity[]> => {      
    const p1 = await UserEntity.create({
        username: "any_username",
        password: "any_password",
    }).save();
  
    const p2 = await UserEntity.create({
        username: "any_username2",
        password: "any_password2",
    }).save();
  
    return [p1, p2];
};

describe('User Routes', () => {
    const server = new App().server;

    beforeAll(async () => {
        await new Database().openConnection();
        const router = Router();
        server.use(express.json());
        server.use(router);
    
        new UserRoutes().init(router);
    });

    beforeEach(async () => {    
        await UserEntity.clear();
        jest.resetAllMocks();
    });

    describe('/GET', () => {
        test('/GET users', async () => {
            const users = await makeUsersDB();
            request(server)
        })
    })

})