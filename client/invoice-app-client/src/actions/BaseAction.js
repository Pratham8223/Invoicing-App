export default class BaseAction {
    constructor() {
        this.BASE_URL = process.env.REACT_APP_BACKEND_URI
    }

    async getUserData(onSuccess, onError) {
        try {
            const res = await fetch(this.BASE_URL, {
                method: "GET",
                credentials: 'include'
            })

            if (res.status === 200) {
                onSuccess((await res.json()))
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