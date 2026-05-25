export interface ICredentials{
    email: string;
    password: string;
}

export interface IAuthUser{
    id: string;
    nombre: string;
    email: string;
    rol: { id: string; nombre: string }
}

export interface ILoginResponse{
    token: string;
    usuario: IAuthUser;
}