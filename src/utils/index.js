const ACCESS_TOKEN = 'token_access'
const EXPIRATION = 'expires_at'
const USUARIO_NOME = 'user_nome'
const USUARIO_EMAIL = 'user_email'
const USUARIO_PERMISSION = 'user_permission'

export class ArmazenadorToken {
    static definirToken(accessToken, expiration) {
        sessionStorage.setItem(ACCESS_TOKEN, accessToken)
        sessionStorage.setItem(EXPIRATION, expiration)
    }
    static definirUsuario(nome, email, permissao) {
        sessionStorage.setItem(USUARIO_NOME, nome)
        sessionStorage.setItem(USUARIO_EMAIL, email)
        sessionStorage.setItem(USUARIO_PERMISSION, permissao)
    }
    static removerToken() {
        sessionStorage.clear()
    }
    static get AccessToken() {
        return sessionStorage.getItem(ACCESS_TOKEN)
    }
    static get ExpirationToken() {
        return sessionStorage.getItem(EXPIRATION)
    }
    static get UserNome() {
        return sessionStorage.getItem(USUARIO_NOME)
    }
    static get UserEmail() {
        return sessionStorage.getItem(USUARIO_EMAIL)
    }
    static get UserPermission() {
        return sessionStorage.getItem(USUARIO_PERMISSION)
    }
}