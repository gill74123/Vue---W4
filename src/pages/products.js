import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js"

// 宣告變數
// 因其他地方還需呼叫此變數，所以定義在外層
let productModal = ""; 
let delProductModal = "";
let logoutModal = "";

const app = createApp({
    data() {
        return {
            baseUrl: "https://vue3-course-api.hexschool.io/v2",
            apiPath: "gillchin",
            products: [],
            tempProduct: {
                imagesUrl: []
            },
            isNew: true,
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
                // console.log(res);
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
        // 開啟 Modal
        openModal(modalStatus, item) {
            // 判斷是新增 or 編輯 Modal
            if (modalStatus === 'new') {
                // 新增 - 清空選取產品內資料
                this.tempProduct = {
                    imagesUrl: []
                }

                // 點擊新增 btn 就把改成 true
                this.isNew = true;

                // 開啟 modal
                productModal.show();
            } else if (modalStatus === 'edit') {
                // 編輯 - 拷貝點選的產品
                this.tempProduct = {...item};

                // 點擊編輯 btn 就把改成 false
                this.isNew = false;

                // 開啟 modal
                productModal.show();
            } else if (modalStatus === 'delete') {
                // 刪除 - 拷貝點選的產品
                this.tempProduct = {...item};

                // 開啟 modal
                delProductModal.show();
            } else if (modalStatus === 'logout') {
                // 開啟 modal
                logoutModal.show();
            }
        },
        // 新增產品/更新編輯產品
        updateProduct(productId) {
            let url = "";
            let httpMethod = "";

            if (this.isNew) {
                url = `${this.baseUrl}/api/${this.apiPath}/admin/product`;
                httpMethod = "post";
            } else {
                url = `${this.baseUrl}/api/${this.apiPath}/admin/product/${productId}`;
                httpMethod = "put";
            }

            axios[httpMethod](url, {data: this.tempProduct})
            .then((res) => {
                // console.log(res);
                // 關閉 Modal
                productModal.hide();

                // 執行 取得產品列表
                this.getProducts();
            })
            .catch((err) => {
                console.log(err.response);
            })
        },
        // 編輯畫面 - 新增多圖
        createImage() {
            // 建立新產品時沒有新增多圖就不會有 tempProduct.imagesUrl 的陣列
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
        // 刪除產品
        delProduct(productId) {
            const url = `${this.baseUrl}/api/${this.apiPath}/admin/product/${productId}`;

            axios.delete(url)
            .then((res) => {
                console.log(res);

                // 關閉 Modal
                delProductModal.hide();

                // 執行 取得產品列表
                this.getProducts();
            })
            .catch((err) => {
                console.log(err.response);
            })
        },
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
        delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {keyboard: false});
        logoutModal = new bootstrap.Modal(document.querySelector('#logoutModal'), {keyboard: false});
    },
})

app.mount('#app');