import IORedis from "ioredis";
import "dotenv/config";

export class Redis {
    static #connection: IORedis.Redis;
    // verifica se a propriedade foi definida
    public static async getConnection(): Promise<IORedis.Redis> {
        if (!this.#connection) {
            await Redis.prototype.openConnection();
        };
        return this.#connection;
    };
    //prototype erda propriedades e permite chamar o open connection
    //mesmo ele sendo static
    public async openConnection(): Promise<void> {
        if (!Redis.#connection) {
            Redis.#connection = new IORedis(process.env.REDIS_URL);
        };
    };
    
}