<template>
    <vl-form-field v-bind="$_wrapperAttributes">
        <div class="vlFormControl">

            <p class="vlImageMsg">
                <i class="icon-picture"/>
                <span v-html="placeholder"/>
            </p>

            <input
                v-bind="$_attributes"
                v-on="$_events"
                type="file"
                ref="input" 
            />
            
            <vl-thumbnail-gallery 
                :images="thumbnails ? thumbnails : []" 
                :height="thumbHeight"
                @remove="remove"/>

        </div>
    </vl-form-field>
</template>

<script>
import FieldImage from '../mixins/FieldImage'

export default {
    mixins: [FieldImage],
    computed:{
        placeholder(){
            return this.$_pristine ? 
                    'Drop your image' + (this.$_multiple ? 's' : '') + ' <br>or click to browse' :
                    ''
        },
        thumbHeight(){
            return this.$_data('thumbHeight')
        }
    },
    methods: {
        addFile(){
            this.$_makeFileImages()
            this.$_blurActionDelayed()
        }
    }
}
</script>