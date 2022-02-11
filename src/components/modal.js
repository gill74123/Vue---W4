const baseUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "gillchin";
let productModal = "";
let alertModal = "";
let fileInput = "";

// 產品新增/編輯 product Modal
export const modalForProduct = {
    props: ['temp-product', 'is-new'],
    methods: { // 原本放在外層，但使用元件後以下方法只會在 modal 會用到此方法，所以直接放置內層
        // 編輯畫面 - 新增多圖
        createImage() {
            // 建立新產品時沒有新增多圖就不會有 tempProduct.imagesUrl 的陣列
            this.tempProduct.imagesUrl = [];
            // this.tempProduct.imagesUrl.push('');
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
                // console.log(res);
                // 關閉 Modal
                this.closeProductModal();

                // 執行 取得產品列表
                this.$emit('get-products'); // 此方法在外層所以要用 emit
            })
            .catch((err) => {
                console.dir(err.response);
            })
        },
        openProductModal() {
            productModal.show();
        },
        closeProductModal() {
            productModal.hide();
        },
        // 圖片上傳
        imageUpload() {
            // console.dir(fileInput);
            const file = fileInput.files[0];
            // console.log(file);

            const formData = new FormData();
            formData.append('file-to-upload', file)

            const url = `${baseUrl}/api/${apiPath}/admin/upload`;


            axios.post(url, formData)
            .then((res) => {
                console.log(res.data.imageUrl);
                this.tempProduct.imagesUrl.push(res.data.imageUrl);
                fileInput.value = "";
            })
            .catch((err) => {
                console.log(err.response);
            })
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.querySelector('#productModal'), {keyboard: false});
        fileInput = document.querySelector('#formFile');
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
        alertModal = new bootstrap.Modal(document.querySelector('#alertModal'), {keyboard: false});
    },
    template: '#alertModal',
}