export class Usuario{
    id: string;
    displayName: string;
    email: string;
    refreshToken: string;
    photoUrl: string;
    provider: string;
    signInMethod: string;


    constructor(id: string, displayName: string, email: string, refreshToken: string, photoUrl: string, provider: string, signInMethod: string) {
        this.id = id;
        this.displayName = displayName;
        this.email = email;
        this.refreshToken = refreshToken;
        this.photoUrl = photoUrl;
        this.provider = provider;
        this.signInMethod = signInMethod;
    }
}
