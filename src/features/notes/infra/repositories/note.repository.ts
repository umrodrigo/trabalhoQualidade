import { NoteEntity } from "../../../../core/infra";
import { User } from "../../../users/domain";
import { Note } from "../../domain";

export class NoteRepository {
    //Cria uma nova nota - store - userID
    async create(params: User, body: Note): Promise<Note> {
        const { id  } = params;
        const { description, details } = body;
        const note = await new NoteEntity(
            description, 
            details, 
            id).save();

        return Object.assign({}, body, params, note);
    };
    //busca todas as notas de todos os usuarios - index
    async getNotes(): Promise<Note[]> {
        const notes = await NoteEntity.find();
        return notes.map(
            (note) =>
                ({
                    id: note.id,
                    description: note.description,
                    details: note.details,
                    userID: note.userID,
                    updatedAt: note.updatedAt,
                } as Note),
        );
    };
    //Busca todas as notas de um usuario
    async getUserNotes(id: string): Promise<Note[]> {
        const notes = await NoteEntity.find({
            where: {
                userID: id,
            },
        });
        return notes.map(
            (note) =>
            ({
                id: note.id,
                description: note.description,
                details: note.details,
                userID: note.userID,
            } as Note),
        );
    };
    //atualiza nota
    async updateNote(id: Note, body: Note ): Promise<Note | undefined> {
        const { description, details } = body;
        const note = await NoteEntity.update(id, {
            description,
            details,
        } as Note);
        return Object.assign({}, body, note);
    };
    //deleta recado
    async noteDelete(id: Note) {
        return await NoteEntity.delete(id);
    };
};