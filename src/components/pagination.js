export default {
    props:['pages', 'products'],
    template: `<div class="d-flex justify-content-center align-items-center">
    <p class="m-3">共 {{products.length}} 筆</p>
    <nav class="" aria-label="Page navigation example">
        <ul class="pagination m-0">
            <li class="page-item" :class="{disabled: !pages.has_pre}">
                <a class="page-link" href="#" aria-label="Previous" @click.prevent="$emit('get-products', pages.current_page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item" :class="{active: page === pages.current_page}" v-for="(page, index) in pages.total_pages" :key="index">
                <a class="page-link" href="#" @click.prevent="$emit('get-products', page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{disabled: !pages.has_next}">
                <a class="page-link" href="#" aria-label="Next" @click.prevent="$emit('get-products', pages.current_page + 1)">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</div>`
}