<template>
    <vl-form-field v-bind="$_wrapperAttributes">
        <div class="vlFormControl">

            <p class="vlImageMsg">
                <i class="icon-picture"/>
                <i v-if="!$_multiple && thumbnails.length" class="icon-times" @click.stop.prevent="remove(0)"/>
                <span v-html="imageMsg"/>
            </p>

            <input
                v-if="!$_readOnly"
                v-bind="$_attributes"
                v-on="$_events"
                type="file"
                ref="input" 
            />


            
            <vl-thumbnail-gallery 
                v-if="$_multiple"
                :images="thumbnails ? thumbnails : []" 
                :height="thumbHeight"
                :previewable="previewable"
                @remove="remove"/>

            <div 
                v-else
                :style="singleImageStyle"/>

        </div>
    </vl-form-field>
</template>

<script>
import FieldImage from '../mixins/FieldImage'

export default {
    mixins: [FieldImage],
    computed:{
        imageMsg(){
            return this.$_pristine ? (this.$_placeholder || this.defaultMsg) : ''
        },
        defaultMsg(){
            return 'Drop your image' + (this.$_multiple ? 's' : '') + ' <br>or click to browse'
        },
        thumbHeight(){
            return this.$_config('thumbHeight')
        },
        previewable(){
            return !this.$_config('thumbPreviewDisabled')
        },
        bgPosition() {
            return this.$_config('bgPosition') || 'center'
        },
        bgSize() {
            return this.$_config('bgSize') || 'cover'
        },
        singleImageStyle(){
            return Object.assign({
                    height: this.thumbHeight || '7.9rem',
                    width: this.thumbHeight || '7.9rem',
                }, this.thumbnails.length ? {
                    'background-image': 'url('+this.thumbnails[0].src+')',
                    'background-size': this.bgSize,
                    'background-position': this.bgPosition,
                } : {}
            )
        },
    },
    methods: {
        addFile(){
            this.$_makeFileImages()
            this.$_blurActionDelayed()
        }
    }
}
</script>