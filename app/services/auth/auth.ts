import type { IAuthUser, ICredentials, ILoginResponse } from "~/types/auth/auth.type";

export const AuthService = () => {
    const { $api } = useNuxtApp();
    return{
        async login(credentials: ICredentials):Promise<ILoginResponse>{
            return await $api('/auth/login',{
                method: 'POST',
                body: credentials
            })
        },
        async logout(): Promise<void>{
            await $api('/auth/logout',{ method: 'POST' })
        },
        async refreshMe(): Promise<IAuthUser>{
            return await $api('/auth/me')
        }
    }
}