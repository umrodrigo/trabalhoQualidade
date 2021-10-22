import { UserEntity } from "../../../../core/infra";
import { User } from "../../domain";


export class UserRepository {
    //Cria novo Usuário
    async create(params: User): Promise<User> {
        const { username, password  } = params;
        const user = await UserEntity.create({
            username,
            password,
        }).save();
        return Object.assign({}, params, user);
    };
    //Busca usuario pelo ID
    async getUser(id: string): Promise<User | undefined> {
        const user = await UserEntity.findOne(id);
        if (!user) return undefined;
        return {
            id: user.id,
            username: user.username,
            password: user.password,
            createdAt: user.createdAt
        }
    }
    //Busca todos os usuarios
    async getUsers(): Promise<User[]> {
        const users = await UserEntity.find();
        return users.map(
            (user) => 
                ({            
                    id: user.id,
                    username: user.username,
                    password: user.password,
                    createdAt: user.createdAt,  
                }),
        );
    };    
    //Atualiza dados do Usuário
    async updateUser(id: string, params: any ): Promise<User> {
        const password = params;
        const user = await UserEntity.update(id, {
            password,
        });
        return Object.assign({}, params, user);
    };
    //Deleta usuário
    async deleteUser(id: string) {
        return await UserEntity.delete(id);
    }

    async login(params: User): Promise<any> {
        const { username, password } = params;
        const login = await UserEntity.findOne({
            where: {
                username, password
            },
        });
        return Object.assign({}, login);
    };
};