import Cookies from 'js-cookie';
export default class POAction {

    constructor() {
        this.BASE_URL = process.env.REACT_APP_BACKEND_URI
    }

    async getMonthData({ month, year }, onSuccess, onError) {
        try {
            const res = await fetch(`${this.BASE_URL}purchase-order/?month=${month}&year=${year}`, {
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

    async deleteInvoice(id, onSuccess, onError) {
        try {
            const res = await fetch(`${this.BASE_URL}purchase-order/${id}/`, {
                method: "DELETE",
                credentials: 'include',
            })
            if (res.status === 200) {
                onSuccess()
            } else {
                onError("Unable to delete invoice")
            }
        } catch (error) {
            console.log(error)
            onError("Unable to delete invoice");
        }
    }

    async postInvoice(body, onSuccess, onError) {
        try {
            const res = await fetch(`${this.BASE_URL}purchase-order/`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            if (res.status === 200) {
                onSuccess((await res.json()))
            } else {
                onError("Something went wrong.")
            }

        } catch (error) {
            console.log(error)
            onError("Something went wrong.")
        }
    }

}