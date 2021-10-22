export class MissingParamError extends Error {
    constructor(paramName: string) {
      super(`Atenção!! ${paramName}`);
      this.name = "MissingParamError";
    }
  }
  