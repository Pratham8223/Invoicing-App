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

}