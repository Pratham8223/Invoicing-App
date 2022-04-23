import Cookies from 'js-cookie';


export default class UserAction {

    constructor() {
        this.BASE_URL = process.env.REACT_APP_BACKEND_URI
    }

    async editUser(userId, editInfo, onSuccess, onError) {
        try {
            const res = await fetch(`${this.BASE_URL}user/${userId}/`, {
                method: "PUT",
                credentials: 'include',
                body: JSON.stringify(editInfo),
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                    'Content-Type': 'application/json',
                },
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

    async createUser(userDetails, onSuccess, onError) {
        try {
            const res = await fetch(`${this.BASE_URL}user/`, {
                method: 'POST',
                body: JSON.stringify(userDetails),
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (res.status === 200) {
                onSuccess((await res.json()));
            }

            if (res.status > 399 && res.status < 499) {
                onError((await res.json()).err);
            }

            if (res.status > 499) {
                onError((await res.json()).err);
            }
        } catch (error) {
            onError("Something went wrong.");
        }
    }
}