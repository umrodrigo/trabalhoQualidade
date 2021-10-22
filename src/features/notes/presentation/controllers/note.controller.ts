import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import { HttpRequest, HttpResponse, MissingParamError, MvcController, notFound, ok, serverError } from "../../../../core/presentation";
import { NoteRepository } from "../../infra";

export class NoteController implements MvcController {
    readonly #repository: NoteRepository;
    readonly #cache: CacheRepository;
    //injeção de dependencia // usado na rota
    constructor(repository: NoteRepository, cache: CacheRepository) {
        this.#repository = repository;
        this.#cache = cache;
    }
    async store(request: HttpRequest): Promise<HttpResponse> {
        try {
            const note = await this.#repository.create(request.params, request.body);
            this.#cache.del(`note:${note.userID}`);
            return ok(note);
        } catch (error) {
            return serverError();
        };
    };
    async update(request: HttpRequest): Promise<HttpResponse> {
        try {
            const id = request.params;
            const userID = request.body.userID;
            const note = await this.#repository.updateNote(id, request.body);
            this.#cache.del(`note:${userID}`);
            return ok(note);
        } catch (error) {
            return serverError();
        };
    };
    async delete(request: HttpRequest): Promise<HttpResponse> {        
        try {
            const userID = request.body.userID;
            const note = await this.#repository.noteDelete(request.params);
            this.#cache.del(`note:${userID}`);
            return ok(note)
        } catch (error) {
            return serverError();
        };
    };
    async index(request: HttpRequest): Promise<HttpResponse> {
        try {
            const notes = await this.#repository.getNotes();

            if (notes.length === 0) return notFound(new MissingParamError('Nenhuma nota encontrada.'));

            return ok(notes);
        } catch (error) {
            return serverError();
        }
    }
    async show(request: HttpRequest): Promise<HttpResponse> {
        const { id } = request.params;
        try {
            this.#cache.del(`note:${id}`);
            const cache = await this.#cache.get(`note:${id}`);
            if (cache) {
                return ok(Object.assign([], cache));
            };

            const note = await this.#repository.getUserNotes(id);
            if (!note) return notFound(new Error());

            await this.#cache.setex(`note:${id}`, note, 360);
            return ok(note);
        } catch (error) {
            return serverError();
        }
    }
}