export default class AuthAction {
    constructor() {
        this.BASE_URL = process.env.REACT_APP_BACKEND_URI
    }

    async signIn(credentials, onSuccess, onError) {

        try {
            const res = await fetch(this.BASE_URL + 'auth/api-login/', {
                method: "POST",
                body: JSON.stringify(credentials),
                credentials: 'include'
            })

            if (res.status === 200) {
                onSuccess((await res.json()).token)
            }

            if (res.status > 399 && res.status < 499) {
                onError((await res.json()).err);
            }

            if (res.status > 499) {
                onError((await res.json()).err);
            }
        } catch (error) {
            onError("Something went wrong.")
        }
    }


    async logout(onSuccess, onError) {
        try {
            const res = await fetch(this.BASE_URL + 'auth/api-logout/' , {
                method: "GET",
                credentials: 'include'
            })

            if (res.status === 200) {
                onSuccess((await res.json()).message)
            }

            if (res.status > 399 && res.status < 499) {
                onError((await res.json()).err);
            }

            if (res.status > 499) {
                onError((await res.json()).err);
            }
        } catch (error) {
            onError("Something went wrong.")
        }
    }
}