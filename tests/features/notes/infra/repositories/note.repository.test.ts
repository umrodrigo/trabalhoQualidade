import { NoteEntity } from "../../../../../src/core/infra";
import Database from "../../../../../src/core/infra/data/connections/database";
import { v4 as uuid } from "uuid";
import { Note } from "../../../../../src/features/notes/domain";
import { NoteRepository } from "../../../../../src/features/notes/infra";

// o id das notas é auto gerado pelo postgree, @PrimaryGeneratedColumn
// ajustado para uuid

const makeNoteDB = async (): Promise<NoteEntity> =>
  NoteEntity.create({
    description: "any_description",
    details: "any_details",
    userID: '2c49ea24-91b2-4332-9501-c0614149e72c',
  }).save();

const makeNoteCreate = () => ({body: {      
    id: 1,
    description: "note.description",
    details: "note.details",
    userID: "note.userID",
    }, params: {id: "2c49ea24-91b2-4332-9501-c0614149e72c"}
});

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

const makeUpdateParams = async (id: number): Promise<Note> => {
    return {
        description: "note.description",
        details: "note.details",
    };
};

describe('Note Repository', () => {
    beforeAll(async () => {
        await new Database().openConnection();
    });
    beforeEach(async () => {
        await NoteEntity.clear();    
    });
    
    afterAll(async () => {
        await new Database().disconnectDatabase();
    });

    // describe('create', () => {
    //     test('deveria retornar um usuario', async () => {            
    //         const sut = new NoteRepository();
    //         const params = await makeNoteDB();
    //         const result = await sut.create(params, body);

    //         expect(result).toBeTruthy();
    //         //expect(result.username).toBe("any_username");
    //         //expect(result.password).toBe("any_password");
    //     })
    // });

    describe('getNotes', () => {
        test('deveria retornar lista de recados', async () => {
            const sut = new NoteRepository();
            const result = await sut.getNotes();
            expect(result).toBeTruthy();
        });        
    });

    describe('getUserNotes', () => {
        test('deveria retornar undefined quando buscar um ID inexistente', async () => {
            const sut = new NoteRepository();
            const result = await sut.getUserNotes(uuid());
            expect(result).toEqual([]);
        });
        test('deveria retornar lista de notas ao informar ID valido', async () => {
            const sut = new NoteRepository();
            const notes = await makeNotesDB()
            const result = await sut.getUserNotes("2c49ea24-91b2-4332-9501-c0614149e72c");
            expect(result).toEqual(notes);
        });       
    });



});

