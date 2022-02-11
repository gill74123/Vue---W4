// 宣告變數
// 因其他地方還需呼叫此變數，所以定義在外層
const baseUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "gillchin";
let productModal = "";
let alertModal = "";
let fileInput = "";

// 產品新增/編輯 product Modal
export const modalForProduct = {
    props: ['temp-product', 'is-new', 'star-rank-data'],
    methods: { // 原本放在外層，但使用元件後以下方法只會在 modal 會用到此方法，所以直接放置內層
        // 編輯畫面 - 新增多圖
        createImage() {
            // 建立新產品時沒有新增多圖就不會有 tempProduct.imagesUrl 的陣列
            this.tempProduct.imagesUrl = [];
        },
        // 新增產品/更新編輯產品
        updateProduct(productId) {
            let url = "";
            let httpMethod = "";

            if (this.isNew) {
                url = `${baseUrl}/api/${apiPath}/admin/product`;
                httpMethod = "post";
            } else {
                url = `${baseUrl}/api/${apiPath}/admin/product/${productId}`;
                httpMethod = "put";
            }

            axios[httpMethod](url, {data: this.tempProduct})
            .then((res) => {
                // 關閉 Modal
                this.closeProductModal();

                // 執行 取得產品列表
                this.$emit('get-products'); // 此方法在外層所以要用 emit
            })
            .catch((err) => {
                console.dir(err.response);
            })
        },
        // 星級等級
        starRank(star) {
            this.tempProduct.starRankData = star;
        },
        // 圖片上傳
        imageUpload(e) {
            // 取得 input file 內的資料
            const file = e.target.files[0];
            // 將格式傳換成 formData
            const formData = new FormData();
            formData.append('file-to-upload', file)

            const url = `${baseUrl}/api/${apiPath}/admin/upload`;
            axios.post(url, formData)
            .then((res) => {
                this.tempProduct.imagesUrl.push(res.data.imageUrl);
                // 清空 input 欄位
                fileInput.value = "";
            })
            .catch((err) => {
                console.log(err.response);
            })
        },
        // 圖片刪除
        imageDelete(index) {
            this.tempProduct.imagesUrl.splice(index, 1);
        },
        openProductModal() {
            productModal.show();
        },
        closeProductModal() {
            productModal.hide();
        },
    },
    mounted() {
        // 使用 new 建立 bootstrap modal，拿到實體 DOM 並賦予到變數上
        productModal = new bootstrap.Modal(document.querySelector('#productModal'), {keyboard: false});

        fileInput = document.querySelector('#fileInput');
    },
    template: '#productModal'
}

// 刪除/登出 alert Modal
export const modalForAlert = {
    props: ['temp-product', 'alert-modal-status'],
    methods: {
        // 刪除產品
        delProduct(productId) {
            const url = `${baseUrl}/api/${apiPath}/admin/product/${productId}`;

            axios.delete(url)
            .then((res) => {
                // console.log(res);
                // 關閉 Modal
                this.closeProductModal();

                // 執行 取得產品列表
                this.$emit('get-products'); // 此方法在外層所以要用 emit
            })
            .catch((err) => {
                console.log(err.response);
            })
        },
        // 登出
        logout() {
            const url = `${baseUrl}/logout`;
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
        openProductModal() {
            alertModal.show();
        },
        closeProductModal() {
            alertModal.hide();
        }
    },
    mounted() {
        // 使用 new 建立 bootstrap modal，拿到實體 DOM 並賦予到變數上
        alertModal = new bootstrap.Modal(document.querySelector('#alertModal'), {keyboard: false});
    },
    template: '#alertModal',
}