import Cookies from 'js-cookie';

export default class ShopAction {

    constructor() {
        this.BASE_URL = process.env.REACT_APP_BACKEND_URI
    }


    async editShop(id, editInfo, onSuccess, onError) {
        
        // const editBody = new FormData();
        // Object.keys(editInfo).forEach(e => {
        //     editBody.append(e, editInfo[e])
        // })

        try {
            const res = await fetch(`${this.BASE_URL}shop/${id}/`, {
                body: JSON.stringify(editInfo),
                method: 'PUT',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                    "Content-Type": "application/json"
                },
                credentials: 'include',
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
            console.log(error)
            onError("Something went wrong.")
        }
    }

    async createShop(shopDetails, onSuccess, onError) {
        const shopDetailForm = new FormData();

        Object.keys(shopDetails).forEach(val => {
            shopDetailForm.append(val, shopDetails[val]);
        })
        shopDetailForm.append('csrfmiddlewaretoken', Cookies.get('csrftoken'))

        try {
            const res = await fetch(`${this.BASE_URL}shop/`, {
                body: shopDetailForm,
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                }
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
            console.log(error)
            onError("Something went wrong.")
        }
    }
}