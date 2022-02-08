import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js"

const app = createApp({
    data() {
        return {
            baseUrl: "https://vue3-course-api.hexschool.io/v2",
            user: {
                username: "",
                password: ""
            }
        }
    },
    methods: {
        login() {
            const url = `${this.baseUrl}/admin/signin`;

            axios.post(url, this.user)
            .then((res) => {
                const {token, expired} = res.data;

                // 將 token, expired 存到 cookie
                document.cookie = `gillToken=${token}; expires=${new Date(expired)}; path=/`;

                // 頁面跳轉
                window.location = "products.html";
            })
            .catch((err) => {
                console.log(err.response);
                alert(err.response.data.message);
            })
        }
    }
})

app.mount('#app');