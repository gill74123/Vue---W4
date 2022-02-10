// 產品新增/編輯 Modal
export const modalForProduct = {
    props: ['temp-product', 'is-new', 'base-url', 'api-path'],
    methods: { // 原本放在外層，但使用元件後以下方法只會在 modal 會用到此方法，所以直接放置內層
        // 編輯畫面 - 新增多圖
        createImage() {
            // 建立新產品時沒有新增多圖就不會有 tempProduct.imagesUrl 的陣列
            tempProduct.imagesUrl = [];
            tempProduct.imagesUrl.push('');
        },
        // 新增產品/更新編輯產品
        updateProduct(productId) {
            let url = "";
            let httpMethod = "";

            if (this.isNew) {
                url = `${this.baseUrl}/api/${this.apiPath}/admin/product`;
                httpMethod = "post";
                console.log("post");
            } else {
                url = `${this.baseUrl}/api/${this.apiPath}/admin/product/${productId}`;
                httpMethod = "put";
                console.log("put");
            }

            axios[httpMethod](url, {data: this.tempProduct})
            .then((res) => {
                // console.log(res);
                // 關閉 Modal
                productModal.hide();

                // 執行 取得產品列表
                this.$emit('get-products'); // 此方法在外層所以要用 emit
            })
            .catch((err) => {
                console.dir(err.response);
            })
        },
    },
    template: '#productModal'
}