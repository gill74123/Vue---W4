import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js"

// 宣告 DOM 元素
let productModal = "";

const app = createApp({
    data() {
        return {
            baseUrl: "https://vue3-course-api.hexschool.io/v2",
            apiPath: "gillchin",
            products: [],
            tempProduct: {
                imagesUrl: []
            },
        }
    },
    methods: {
        // 確認使用者
        checkAdmin() {
            const url = `${this.baseUrl}/api/user/check`;
            axios.post(url)
            .then((res) => {
                // console.log(res);
                // 執行 取得產品列表
                this.getProducts();
            })
            .catch((err) => {
                console.log(err.response);
                alert(err.response.data.message);

                // 頁面跳轉
                window.location = "login.html";
            })
        },
        // 登出
        logout() {
            const url = `${this.baseUrl}/logout`;
            axios.post(url)
            .then((res) => {
                console.log(res);
                alert(res.data.message);

                // 頁面跳轉
                window.location = "login.html";
            })
            .catch((err) => {
                console.log(err.response);
            })
        },
        // 取得產品列表
        getProducts() {
            const url = `${this.baseUrl}/api/${this.apiPath}/admin/products`;
            axios.get(url)
            .then((res) => {
                // console.log(res);
                this.products = res.data.products;
            })
            .catch((err) => {
                console.log(err.response);
            })
        },
        // 開啟 新增/編輯 Product Modal
        openProductModal(modalStatus) {
            // 判斷是新增 or 編輯 Modal
            if (modalStatus === 'new') {
                // 新增 - 清空選取產品內資料
                this.tempProduct = {
                    imagesUrl: []
                }

                productModal.show();
            }
        }
    },
        
    mounted() {
        // 取 cookie 內的 token
        const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)gillToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // 將 token 帶入 axios headers
        axios.defaults.headers.common['Authorization'] = myToken;

        // 執行 確認使用者
        this.checkAdmin();

        // 使用 new 建立 bootstrap modal，拿到實體 DOM 並賦予到變數上
        // 新增/編輯 ProductModal
        productModal = new bootstrap.Modal(document.querySelector('#productModal'), {keyboard: false});
    },
})

app.mount('#app');