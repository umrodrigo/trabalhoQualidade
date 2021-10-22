import { HttpRequest, MissingParamError, notFound, ok, serverError } from "../../../../src/core/presentation";
import { UserRepository } from "../../../../src/features/users/infra";
import { UserController } from "../../../../src/features/users/presentation/controllers";

const makeSut = ():UserController => 
    new UserController(
        new UserRepository());

const makeRequestStore = (): HttpRequest => ({
    body: {
        username: 'any_name',
        password: 'any_password'
    },
    params: {}
});

const makeRequestIndex = (): HttpRequest => ({
    headers: {},
    body: {},
    params: {}
});

const makeRequestShow = (): HttpRequest => ({
    headers: {},
    body: {},
    params: { id: "any_id" }
});

const makeUserResult = () => ({      
        id: "user.id",
        username: "user.username",
        password: "user.password",
        createdAt: new Date('2021-01-01')
});
const makeUserUpdate = () => ({
    password: "any_password"
})
const makeUserResult2 = () => ({body:[{      
    id: "user.id",
    username: "user.username",
    password: "user.password",
    createdAt: new Date('2021-01-01')}],
    statusCode: 200
});
const makeUserResultError = () => ({body:[{}], //index
    statusCode: 200
});

describe('user controller', () => {
    //Testear o Store do User Controller
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('Store', () => {
        test('Deveria retornar Status 500 se houver erro', async () => {
            jest
                .spyOn(UserRepository.prototype, 'create')
                .mockRejectedValue(new Error());
            const sut = makeSut();
            const result = await sut.store(makeRequestStore());

            expect(result).toEqual(serverError());
        });
        test('Deveria chamar o repositorio com valores corretos', async () => {
            const createSpy = jest.spyOn(UserRepository.prototype, 'create');
            const sut = makeSut();
            await sut.store(makeRequestStore());

            expect(createSpy).toHaveBeenCalledWith(makeRequestStore().body);
        });
    });

    describe('Index', () => {
        test('deveria retornar 500 ao acontecer erro', async () => {
            jest.spyOn(UserRepository.prototype, 'getUsers')
                .mockRejectedValue(new Error());
            const sut = makeSut();
            const result = await sut.index(makeRequestIndex());

            expect(result).toEqual(serverError());
        });
        test('deveria retornar lista de projetos', async () => {
            jest.spyOn(UserRepository.prototype, 'getUsers')
                .mockResolvedValue([makeUserResult()]);
            const sut = makeSut();
            
            const result = await sut.index(makeRequestIndex());

            expect(result).toEqual(makeUserResult2());
        });
        // test('deveria retornar notFound se não achar nenhum usuario', async () => {
        //     jest.spyOn(UserRepository.prototype, 'getUsers')
        //          .mockResolvedValue(null)          
        //     const sut = makeSut();
            
        //     const result = await sut.index(makeRequestIndex())
        //     expect(result).toEqual(notFound(new Error))
        // }); 
    });
    describe('show', () => {
        test('deveria retornar 500 ao acontecer erro', async () => {
            jest.spyOn(UserRepository.prototype, 'getUser')
                .mockRejectedValue(new Error());
            const sut = makeSut();
            const result = await sut.show(makeRequestShow());

            expect(result).toEqual(serverError());
        });
        test('deveria retornar notFund ao não encontrar id', async () => {
            jest.spyOn(UserRepository.prototype, 'getUser')
                .mockResolvedValue(undefined);
            const sut = makeSut();
            const result = await sut.show(makeRequestShow());
            
            expect(result).toEqual(notFound(new Error()));
        });
        test('deveria retornar um usuario', async () => {
            jest.spyOn(UserRepository.prototype, 'getUser')
                .mockResolvedValue(makeUserResult());
            const sut = makeSut();
            const result = await sut.show(makeRequestShow());

            expect(result).toEqual(ok(makeUserResult()));
        });
    });
    describe('update', () => {
        test('deveria retornar 500 ao acontecer erro', async () => {
            jest.spyOn(UserRepository.prototype, 'updateUser')
                .mockRejectedValue(new Error());
            const sut = makeSut();
            const result = await sut.update(makeRequestShow());

            expect(result).toEqual(serverError());
        });
        test('deveria retornar objeto atualizado', async () => {
            jest.spyOn(UserRepository.prototype, 'updateUser')
                .mockResolvedValue(makeUserResult());
            const sut = makeSut();
            const result = await sut.update(makeRequestShow());

            expect(result).toEqual(ok(Object.assign({},makeUserResult())))
        });    
    });
    describe('delete', () => {
        test('deveria retornar 500 ao acontecer erro', async () => {
            jest.spyOn(UserRepository.prototype, 'updateUser')
                .mockRejectedValue(new Error());
            const sut = makeSut();
            const result = await sut.delete(makeRequestShow());
            expect(result).toEqual(serverError());
        });
        // test('deveria retornar 200 ao deletar usuario', async () => {
        //     jest.spyOn(UserRepository.prototype, 'deleteUser')
        //     const sut = makeSut();
        //     const result = await sut.delete(makeRequestShow());

        //     expect(result).toEqual(ok(result))
        // });
    });
    describe('login', () => {
        test('deveria retornar 500 ao acontecer erro', async () => {
            jest.spyOn(UserRepository.prototype, 'login')
                .mockRejectedValue(new Error());
            const sut = makeSut();
            const result = await sut.login(makeRequestShow());
            expect(result).toEqual(serverError());
        });
        test('deveria retornar 404 ao não encontrar usuario', async () => {
            jest.spyOn(UserRepository.prototype, 'login')
                .mockRejectedValue(notFound(new MissingParamError('error')));
            const sut = makeSut();
            const result = await sut.login(makeRequestStore());

            expect(result).toBeTruthy();
        });
        
        
    });
    
    
    
    
    
    
});
