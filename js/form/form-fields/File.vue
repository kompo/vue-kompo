<template>
    <vl-form-field v-bind="$_wrapperAttributes">
        <vlTaggableInput 
            v-bind="$_taggableInputAttributes" 
            v-on="$_taggableInputEvents"
            :labelKey="labelKey">
            <span v-if="$_pristine" class="vlSingle" v-html="$_placeholder" />
            <input
                v-bind="$_attributes"
                v-on="$_events"
                type="file"
                ref="input" />
            <template v-slot:append>
                <i class="icon-upload"/>
            </template>
        </vlTaggableInput>
    </vl-form-field>
</template>

<script>
import FieldFile from '../mixins/FieldFile'
import HasTaggableInput from '../mixins/HasTaggableInput'

export default {
    mixins: [FieldFile, HasTaggableInput],
    data(){
        return {
            labelKey: 'name'
        }
    },
    methods: {
        addFile(){
            this.$_addRefFiles()
            this.$_blurActionDelayed()
            this.$_changeAction()
        },
        uploadFiles(){
            this.$refs.input.click()
        }
    }
}
</script>