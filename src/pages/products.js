import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js";
import pagination from "../components/pagination.js";
import { modalForProduct, modalForAlert } from "../components/modal.js";

const baseUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "gillchin";

const app = createApp({
    data() {
        return {
            products: [],
            pagination: {},
            tempProduct: {
                imagesUrl: []
            },
            isNew: true,
            starRankData: 0,
            alertModalStatus: "",
        }
    },
    components: {
        // 分頁元素
        'pagination': pagination,
        'product-modal': modalForProduct,
        'alert-modal': modalForAlert,
    },
    methods: {
        // 確認使用者
        checkAdmin() {
            const url = `${baseUrl}/api/user/check`;
            axios.post(url)
            .then((res) => {
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
        // 取得產品列表
        getProducts(page = 1) { // 參數預設值
            // query 參數用?帶入網址
            const url = `${baseUrl}/api/${apiPath}/admin/products?page=${page}`;
            axios.get(url)
            .then((res) => {
                this.products = res.data.products;
                this.pagination = res.data.pagination; // 取得分頁資訊
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
                this.$refs.productModal.openProductModal()
            } else if (modalStatus === 'edit') {
                // 編輯 - 拷貝點選的產品
                this.tempProduct = {...item};

                // 點擊編輯 btn 就把改成 false
                this.isNew = false;

                // 開啟 modal
                this.$refs.productModal.openProductModal()
            } else if (modalStatus === 'delete') {
                // 刪除 - 拷貝點選的產品
                this.tempProduct = {...item};

                this.alertModalStatus = modalStatus;
                
                // 開啟 modal
                this.$refs.alertModal.openProductModal();
            } else if (modalStatus === 'logout') {
                this.alertModalStatus = modalStatus;

                // 開啟 modal
                this.$refs.alertModal.openProductModal();
            }
        },
        
    },
    mounted() {
        // 取 cookie 內的 token
        const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)gillToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // 將 token 帶入 axios headers
        axios.defaults.headers.common['Authorization'] = myToken;

        // 執行 確認使用者
        this.checkAdmin();
    },
})

app.mount('#app');