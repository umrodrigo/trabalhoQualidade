import { Connection, createConnection } from "typeorm";

export default class Database {
  private static connection: Connection;

  public static getConnection(): Connection {
    if (!Database.connection) {
      throw new Error("CONEXAO_DATABASE_NAO_ABERTA");
    }

    return Database.connection;
  }

  public async openConnection(): Promise<void> {
    if (!Database.connection) {
      Database.connection = await createConnection();
    }
  }

  public async disconnectDatabase() {
    if (!Database.connection) {
      throw new Error("CONEXAO_DATABASE_NAO_ABERTA");
    }

    await Database.connection.close();
  }
}



/*
export class Database {
    static #connection: Connection | undefined;//.. do typeORM

    constructor() {};//para ninguem abrir uma instancia

    static async getConnection(): Promise<Connection> {
        if(!this.#connection) {
            this.prototype.openConnection();
            //prototype faz referencia a Database
        };//abre a conexão e depois a retorna
        return this.#connection as Connection;
    };
    public async openConnection(): Promise<void> {
        Database.#connection = await createConnection();//.. do typeORM
    };
    static async disconnectDatabase(): Promise<void> {
        if(!Database.#connection) {
            return;
        }
        await this.#connection?.close();
        Database.#connection = undefined;
        //para manter a logica caso tenha que abrir novamente a conec..
    }
}
*/