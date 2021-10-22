import  express, { Router }  from "express";
import cors from "cors";
import NoteRoutes from "../../features/notes/presentation/routes/routes";
import UserRoutes from "../../features/users/presentation/routes/routes";

export class App {
    // somente leitura, privado
    readonly #express: express.Application;

    constructor() {
        this.#express = express();
    };

    public init(): void {
        this.middlewares();
        this.routes();
    };

    public get server(): express.Application {
        return this.#express;
    }

    public middlewares(): void {
        this.#express.use(express.json());
        this.#express.use(express.urlencoded({ extended: false }));
        this.#express.use(cors());
    };

    public routes(): void {
        const router = Router();
        router.get('/', (_, res) => res.json('API ta ON'));
        new UserRoutes().init(router);
        new NoteRoutes().init(router);

        this.#express.use('/api', router);
    }

    public start(port: number): void {
        this.#express.listen(port, () => 
            console.log(`server is ON ${port}`));
    }
}