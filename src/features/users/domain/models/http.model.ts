export interface User {
    id: string;
    username: string;
    password: string;
    password2?: string;
    createdAt?: Date;
    updatedAt?: Date;
};