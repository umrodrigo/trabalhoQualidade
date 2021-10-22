import { NoteEntity } from "../../../../src/core/infra";
import express, { Router } from "express";
import request from "supertest";
import { NoteRepository } from "../../../../src/features/notes/infra";
import { v4 as uuid } from "uuid";
import Database from "../../../../src/core/infra/data/connections/database";
import { App } from "../../../../src/core/presentation";
import NoteRoutes from "../../../../src/features/notes/presentation/routes/routes";


const makeNoteDB = async (): Promise<NoteEntity> =>
NoteEntity.create({
  description: "any_description",
  details: "any_details",
  userID: '2c49ea24-91b2-4332-9501-c0614149e72c',
}).save();

const makeNotesDB = async (): Promise<NoteEntity[]> => {      
    const p1 = await NoteEntity.create({
        description: "note.description",
        details: "note.details",
        userID: "2c49ea24-91b2-4332-9501-c0614149e72c",
    }).save();
  
    const p2 = await NoteEntity.create({
        description: "note.description",
        details: "note.details",
        userID: "2c49ea24-91b2-4332-9501-c0614149e72c",
    }).save();
  
    return [p1, p2];
};

describe('Note Routes', () => {
    const server = new App().server;

    beforeAll(async () => {
        await new Database().openConnection();
        const router = Router();
        server.use(express.json());
        server.use(router);
    
        new NoteRoutes().init(router);
    });

    beforeEach(async () => {    
        await NoteEntity.clear();
        jest.resetAllMocks();
    });

    describe('/GET', () => {
        test('/note deveria retornar uma lista de notas', async () => {
            const notes = await makeNoteDB();
            await request(server)
                .get('/note')
                .send()
                .expect(200)
                .expect((res) => {
                    expect((res.body as []).length).toBe(notes.length);
                });
        });
        test('/note/id deveria retornar notas do usuário caso id seja valido', async () => {
            const notes = await makeNoteDB();
            await request(server)
                .get(`/note/${notes.id}`)
                .send()
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(notes.id);
                });
        });
        test('/note/id deveria retornar 400 caso id seja invalido', async () => {
            const notes = await makeNoteDB();
            await request(server)
                .get(`/note/${uuid()}`)
                .send()
                .expect(400, {error: 'Atenção!! Usuário não encontrado.'});
        });
    });

    describe('/post', () => {
        test('/note/id deveria retornar 400 ao tentar buscar id inexistente', async () => {
            const notes = await makeNoteDB();
            await request(server)
                .post('/note')
                .send({
                    id: uuid(),    
                })
                .expect(400, {error: 'Usuário não encontrado.'});
        });
        test('/note/id deveria retornar 400 ao tentar buscar id inexistente', async () => {
            const notes = await makeNoteDB();
            await request(server)
                .post('/note')
                .send({
                    id: '2c49ea24-91b2-4332-9501-c0614149e72c',
                    description: ''   
                })
                .expect(400, {error: 'Atenção!! A descrição não pode estar em branco.'});
        });
        test('/note/id deveria retornar 200 ao criar novo user', async () => {
            const notes = await makeNoteDB();
            await request(server)
                .post('/users')
                .send({
                    id: '2c49ea24-91b2-4332-9501-c0614149e72c'
                })
                .expect(200);
        });
    })


});