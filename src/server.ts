import { Database } from './core/infra';
import { Redis } from './core/infra/data/connections/redis';
import { App } from './core/presentation';



//Database.getConnection()
//    .then((_) => {
//        const app = new App();
//        app.init();
//        app.start(8080);
//}).catch(console.error);
Promise.all([
    Database.getConnection(),
    Redis.getConnection()])
    .then(() => {
        const app = new App();
        app.init();
        app.start(8080);
    }).catch(console.error);