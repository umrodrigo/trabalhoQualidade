import { NoteEntity, UserEntity } from "../../../../../src/core/infra";
import Database from "../../../../../src/core/infra/data/connections/database";
import { UserRepository } from "../../../../../src/features/users/infra";
import { v4 as uuid } from "uuid";
import { User } from "../../../../../src/features/users/domain";

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

const makeUpdateParams = async (id: string): Promise<User> => {
    return {
        username: "any_name",
        password: "updated",
        id: uuid(),
    };
  };

describe('User Repository', () => {
    beforeAll(async () => {
        await new Database().openConnection();
    });
    beforeEach(async () => {
        await UserEntity.clear();    
    });
    
    afterAll(async () => {
        await new Database().disconnectDatabase();
    });

    describe('create', () => {
        test('deveria retornar um usuario', async () => {
            const sut = new UserRepository();
            const params = await makeUserDB();
            const result = await sut.create(params);

            expect(result).toBeTruthy();
            expect(result.username).toBe("any_username");
            expect(result.password).toBe("any_password");
        })
    })

    describe('getUser', () => {
        test('deveria retornar undefined quando buscar um ID inexistente', async () => {
            const sut = new UserRepository();
            const result = await sut.getUser(uuid());
            expect(result).toBeFalsy();
        });
        test("Deveria retornar um user para um ID válido", async () => {
            const sut = new UserRepository();
            const user = await makeUserDB();
      
            const result = await sut.getUser(user.id);
      
            expect(result).toBeTruthy();
            expect(result?.id).toBe(user.id);
            expect(result?.username).toBe(user.username);
            expect(result?.password).toBe(user.password);    
          });
    });

    describe('getUsers', () => {
        test('Deveria retornar a lista de usuarios', async () => {
            const sut = new UserRepository();
            const users = await makeUsersDB();
            const result = await sut.getUsers();

            expect(result).toBeTruthy();
            expect(result.length).toBe(users.length);
        });
    });

    describe("update", () => {
        test("Deveria atualizar um usuario para um ID válido", async () => {
            const sut = new UserRepository();
            const user = await makeUserDB();
            const params = await makeUpdateParams(user.id);
            const result = await sut.updateUser(user.id, params);
    
            expect(result).toBeTruthy();
        });
    });
    
    describe("delete", () => {
        test("Deveria excluir um projeto para um ID válido", async () => {
          const sut = new UserRepository();
          const user = await makeUserDB();
    
          const result = await sut.deleteUser(user.id);
    
          expect(result).toBeTruthy();
        });
    });

    describe("login", () => {
        test("Deveria retornar um usuario", async () => {
          const sut = new UserRepository();
          const user = await makeUserDB();
    
          const result = await sut.login(user);
    
          expect(result).toBeTruthy();
        });
    });

});