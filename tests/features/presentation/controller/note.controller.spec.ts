import { CacheRepository } from "../../../../src/core/infra/repositories/cache.repository";
import { HttpRequest, notFound, ok, serverError } from "../../../../src/core/presentation";
import { NoteRepository } from "../../../../src/features/notes/infra";
import { NoteController } from "../../../../src/features/notes/presentation/controllers";
import { v4 as uuid } from "uuid";
import { NoteEntity } from "../../../../src/core/infra";


const makeSut = (): NoteController =>
new NoteController(new NoteRepository(), new CacheRepository());

const makeRequestStore = (): HttpRequest => ({
    body: {      
      description: "any_description",
      details: "any_details",  
    },
    params: {
        id: '2c49ea24-91b2-4332-9501-c0614149e72c',
    },
});

const makeRequestIndex = (): HttpRequest => ({
    headers: {},
    body: {},
    params: {}
});

const makeNoteResult = () => ({      
    id: 1,
    description: "note.description",
    details: "note.details",
    userID: "note.userID",
    updatedAt: new Date('2021-01-01'),
});

const makeNoteResult2 = () => ({body:[{      
    id: 1,
    description: "note.description",
    details: "note.details",
    userID: "note.userID",
    updatedAt: new Date('2021-01-01'),}],
    statusCode: 200
});

const makeNotesDB = async (): Promise<NoteEntity[]> => {      
    const p1 = await NoteEntity.create({
        description: "note.description",
        details: "note.details",
        userID: "note.userID",
    }).save();
  
    const p2 = await NoteEntity.create({
        description: "note.description",
        details: "note.details",
        userID: "note.userID",
    }).save();
  
    return [p1, p2];
};

const makeRequestShow = (): HttpRequest => ({
    headers: {},
    body: {},
    params: { id: 5 }
});

describe('note controller', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    
    describe('Store', () => {
        test('Deveria retornar Status 500 se houver erro', async () => {
            jest
            .spyOn(NoteRepository.prototype, "create")
            .mockRejectedValue(new Error());
            const getSpy = jest.spyOn(CacheRepository.prototype, 'del')
                .mockRejectedValue(null);

            const sut = makeSut();
            const result = await sut.store(makeRequestStore());
            expect(result).toEqual(serverError());
        });

        // test("Deveria chamar o Repositorio com valores corretos", async () => {
        //     const createSpy = jest.spyOn(NoteRepository.prototype, "create");
        //     const delSpy = jest.spyOn(CacheRepository.prototype, 'del');
            
        //     const sut = makeSut();
        //     const note = makeRequestStore()
        //     await sut.store(note);
      
        //     expect(createSpy).toHaveBeenCalledWith(ok({
        //         id: 1,
        //         description: 'note.description',
        //         details: 'note.details',
        //         userID: '2c49ea24-91b2-4332-9501-c0614149e72c',
        //         updatedAt: 'note.updatedAt',
        //     }))    
        //   });
    });
    describe('Index', () => {
        test('deveria retornar 500 ao acontecer erro', async () => {
            jest.spyOn(NoteRepository.prototype, 'getNotes')
                .mockRejectedValue(new Error());
            const sut = makeSut();
            const result = await sut.index(makeRequestIndex());

            expect(result).toEqual(serverError());
        });

        test('deveria retornar lista de projetos', async () => {
            jest.spyOn(NoteRepository.prototype, 'getNotes')
                .mockResolvedValue([makeNoteResult()]);
            const sut = makeSut();
            
            const result = await sut.index(makeRequestIndex());

            expect(result).toEqual(makeNoteResult2());
        });
        test('deveria retornar notFound se não achar nenhum usuario', async () => {
            jest.spyOn(NoteRepository.prototype, 'getNotes')
                 .mockRejectedValue(null);     
            const sut = makeSut();
            
            const result = await sut.index(makeRequestIndex());
            expect(result).toEqual(serverError());
        });
    })
    describe('show', () => {
        test('deveria retornar 500 ao acontecer erro', async () => {
            jest.spyOn(NoteRepository.prototype, 'getUserNotes')
                .mockRejectedValue(new Error());
            const delSpy = jest.spyOn(CacheRepository.prototype, "del");
            const sut = makeSut();
            const result = await sut.show(makeRequestShow());

            expect(result).toEqual(serverError());
        });

        // test("Deveria retornar 404 se o projeto não existir", async () => {
        //     jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
      
        //     jest
        //       .spyOn(NoteRepository.prototype, "getUserNotes")
        //       .mockResolvedValue(makeNotesDB());
      
        //     const sut = makeSut();
        //     const result = await sut.show(makeRequestShow());
      
        //     expect(result).toEqual(notFound(new Error()));
        // });

        // test("Deveria retornar 200 se o projeto existir", async () => {
        //     const getSpy = jest
        //       .spyOn(CacheRepository.prototype, "get")
        //       .mockResolvedValue(null);
      
        //     const setSpy = jest
        //       .spyOn(CacheRepository.prototype, "setex")
        //       .mockResolvedValue(null);
      
        //     jest
        //       .spyOn(NoteRepository.prototype, "getUserNotes")
        //       .mockResolvedValue(makeNotesDB());
      
        //     const sut = makeSut();
        //     const result = await sut.show(makeRequestShow());
      
        //     expect(result).toEqual(ok(makeNoteResult()));
        //     expect(getSpy).toHaveBeenLastCalledWith(
        //       `note:${makeNoteResult().id}`
        //     );
        //     expect(setSpy).toHaveBeenLastCalledWith(
        //       `note:${makeNoteResult().id}`,
        //       makeNoteResult(),
        //       360
        //     );
        //   });
    });
    describe('update', () => {
        test('deveria retornar 500 ao acontecer erro', async () => {
            jest.spyOn(NoteRepository.prototype, 'updateNote')
                .mockRejectedValue(new Error());
            const sut = makeSut();
            const result = await sut.update(makeRequestShow());

            expect(result).toEqual(serverError());
        });
        test('deveria retornar objeto atualizado', async () => {
            jest.spyOn(NoteRepository.prototype, 'updateNote')
                .mockResolvedValue(makeNoteResult());
            const sut = makeSut();
            const result = await sut.update(makeRequestShow());

            expect(result).toEqual(ok(Object.assign({},makeNoteResult())))
        });    
    });
    describe('delete', () => {
        test('deveria retornar 500 ao acontecer erro', async () => {
            jest.spyOn(NoteRepository.prototype, 'noteDelete')
                .mockRejectedValue(new Error());
            const sut = makeSut();
            const result = await sut.delete(makeRequestShow());
            expect(result).toEqual(serverError());
        });
    });
    
});