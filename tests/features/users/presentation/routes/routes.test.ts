import express, { Router } from "express";
import request from "supertest";
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
        test('/users deveria retornar uma lista de usuarios', async () => {
            const users = await makeUsersDB();
            await request(server)
                .get('/users')
                .send()
                .expect(200)
                .expect((res) => {
                    expect((res.body as []).length).toBe(users.length);
                });
        });
        test('/users/id deveria retornar um usuário caso id seja valido', async () => {
            const user = await makeUserDB();
            await request(server)
                .get(`/users/${user.id}`)
                .send()
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(user.id);
                });
        });
        test('/users/id deveria retornar 400 caso id seja invalido', async () => {
            const user = await makeUserDB();
            await request(server)
                .get(`/users/${uuid()}`)
                .send()
                .expect(400, {error: 'Atenção!! Usuário não encontrado.'});
        });
    });

    describe('/post', () => {
        test('/users deveria retornar 400 ao tentar salvar user sem username', async () => {
            await request(server)
                .post('/users')
                .send({
                    username: "",
                    password: "1346",
                })
                .expect(400, {error: 'Atenção!! O nome de usuário deve ser informado.'});
        });
        test('/users deveria retornar 400 ao tentar salvar Usuário existente', async () => {
            const user = await makeUserDB();
            await request(server)
                .post('/users')
                .send({
                    username: "any_username",
                    password: "any_password",
                })
                .expect(400, {error: 'Atenção!! Usuário existente, tente novamente.'});
        });
        test('/users/login deveria retornar 400 com username invalido', async () => {
            await request(server)
                .post('/users/login')
                .send({
                    username: "any_username",
                    password: "any_password",
                })
                .expect(400, {error: 'Atenção!! Usuário incorreto, tente novamente.'});
        });
        test('/users/login deveria retornar 400 com username < 3 caracteres', async () => {
            await request(server)
                .post('/users/login')
                .send({
                    username: "an",
                    password: "any_password",
                })
                .expect(400, {error: 'Atenção!! Usuário deve conter ao menos 3 caracteres.'});
        });
        test('/users deveria retornar 200 ao criar novo user', async () => {
            await request(server)
                .post('/users')
                .send({
                    username: "username",
                    password: "password",
                    password2: "password"
                })
                .expect(200);
        });


        test('/users deveria retornar 400 ao tentar salvar user sem password', async () => {
            const user = await makeUserDB();
            await request(server)
                .post('/users')
                .send({
                    username: "any_username",
                    password: "",
                })
                .expect(400, {error: 'Atenção!! A senha deve ser informada.'});
        });
        test('/users deveria retornar 400 ao tentar salvar user se password < 3 caracteres', async () => {
            const user = await makeUserDB();
            await request(server)
                .post('/users')
                .send({
                    username: "any_username",
                    password: "11",
                })
                .expect(400, {error: 'Atenção!! A senha deve conter ao menos 4 caracteres.'});
        });
        test('/users deveria retornar 400 ao tentar salvar password diferente', async () => {
            await request(server)
                .post('/users')
                .send({
                    username: "any_username",
                    password: "anypass",
                    password2: "anypassword"
                })
                .expect(400, {error: 'Atenção!! As senhas não coincidem, tente novamente.'});
        });  
        test('/users/login deveria retornar 400 com password invalido', async () => {
            const user = await makeUserDB();
            await request(server)
                .post('/users/login')
                .send({
                    username: "any_username",
                    password: "any_pass",
                })
                .expect(400, {error: 'Atenção!! Senha incorreta, tente novamente.'});
        });
        test('/users/login deveria retornar 200 login efetuado', async () => {
            const user = await makeUserDB();
            await request(server)
                .post('/users/login')
                .send({
                    username: "any_username",
                    password: "any_password",
                })
                .expect(200);
        });
    });
});