import { NoteEntity } from "../../../../core/infra";
import { badRequest, HttpRequest, HttpResponse, Middleware, MissingParamError, ok } from "../../../../core/presentation";
import { Note } from "../../domain";

export class NoteDescription implements Middleware {
    async handle(request: HttpRequest): Promise<HttpResponse> {
        const description: Note = request.body;
        if (!description) {
            return badRequest(new MissingParamError('A descrição não pode estar em branco.'));                       
        };
        return ok({})
    };
};

export class NoteId implements Middleware {
    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { id }: Note = request.params;
        const note = await NoteEntity.findOne(id);
        if (!note) {
            return badRequest(new MissingParamError('A nota não existe.'));                       
        };
        return ok({});
    };
};
