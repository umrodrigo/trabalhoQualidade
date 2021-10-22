import { Redis } from "../data/connections/redis";

export class CacheRepository {
    // define dados do cache
    public async set(key: string, value: any): Promise<string | null> {
        const redis = await Redis.getConnection();
        return await redis.set(key, JSON.stringify(value));
    };

    //define tempo para expirar nos dados do cache
    public async setex(key: string, value: any, ttl: number): Promise<string | null> {
        const redis = await Redis.getConnection();
        return await redis.set(key, JSON.stringify(value), 'EX', ttl);
    }
    //buscar valores do cache
    public async get(key: string): Promise<any | null> {
        const redis = await Redis.getConnection();
        const value = await redis.get(key);

        if (!value) return null;

        return JSON.parse(value);
    };
    // deletar os dados
    public async del(key: string): Promise<boolean> {
        const redis = await Redis.getConnection();
        const result = await redis.del(key);
        return result !== 0;
    };
}