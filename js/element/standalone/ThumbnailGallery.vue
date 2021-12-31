<template>
    <div>
        <draggable 
        	v-if="images.length > 0" 
        	:list="images" 
            class="gallery-list clearfix"
            :class="images.length > 4 ? 'large-gallery' : '' " >
            <transition-group name="gallery-transition">
              	<vl-thumbnail 
              		v-for="(image, index) in images"
                    :key="index + 0" 
                    :image="image" 
                    :height="calculatedHeight"
                    :index="index"
                    :previewable="previewable"
                    @remove="remove"
                    @preview="previewAndOpen" />
            </transition-group>
        </draggable>
    </div>
</template>

<script>

import EmitsEvents from '../mixins/EmitsEvents'
import draggable from 'vuedraggable'

export default {
    mixins: [EmitsEvents],
    props: {
        images: {type: Array, required: true}, 
        height: {type: String, required: false},
        previewable: {type: Boolean, default: true}
    },

    components: { draggable },

    data: () => ({
        previewIndex: null,
        previewImage: null,
        id: null,
    }),

    computed: {
        calculatedHeight(){
            return this.height ? this.height : (this.images.length > 4 ? '2.9rem' : '6.3rem')
        }
    },

    methods: {
        previewAndOpen(index){
            this.preview(index)
            //this.$kompo.vlModalShow(this.modalname)
        },
        preview(index){
            this.previewIndex = index
            const previewImage = this.images[this.previewIndex]

            this.previewImage = {
                data: {
                    vueComponent: 'Img',
                    id: 'image',
                    src: previewImage.src,
                    alt: previewImage.alt,
                    class: 'image-preview',
                }
            }

            this.$kompo.vlFillModal(this.previewImage, this.id, {
                arrows: true,
            })
        },
        previousImage(){
            this.preview(this.previewIndex == 0 ? this.images.length - 1 : this.previewIndex - 1)
        },
        nextImage(){
            this.preview(this.previewIndex == this.images.length - 1 ? 0 : this.previewIndex + 1)
        },
        remove(index){
            this.$emit('remove',index)
        },
        close(){
            this.previewImage = null
        },
        $_attachEvents(){
            this.$_vlOn('vlGalleryPrevious', () => {
                this.previousImage()
            })
            this.$_vlOn('vlGalleryNext', () => {
                this.nextImage()
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
                'vlGalleryPrevious',
                'vlGalleryNext',
            ])
        }
    },
    created(){
        this.id = Math.random().toString(36).substr(2, 5) //uniq id
    
        this.$_destroyEvents()
        this.$_attachEvents()
    },
    updated() {
        this.$_destroyEvents()
        this.$_attachEvents()
    }
}
</script>