<template>
    <div class="vlMasonry">
        <div v-masonry transition-duration="0.3s" item-selector=".item">
            <component 
                v-for="(item, index) in items"
                :key="itemKey(item)"
                v-bind="$_attributes(item, index)" 
                v-masonry-tile 
                class="item"
                @preview="preview"
            />
        </div>
    </div>
</template>

<script>
import Layout from '../mixins/Layout'

export default {
    mixins: [Layout],

    data: () => ({
        previewIndex: null,
        previewImage: null,
        id: null,
    }),

    methods:{
        
        preview(index){

            this.previewIndex = index
            const previewImage = this.itemRender(this.items[this.previewIndex]).elements.image

            this.previewImage = {
                data: {
                    vueComponent: 'Img',
                    id: 'image',
                    src: previewImage,
                    class: 'image-preview',
                }
            }

            this.$kompo.vlFillModal(this.previewImage, this.kompoid)
        },
    }
}
</script>
