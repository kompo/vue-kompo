<template>
    
    <label 
        v-if="!noLabel" 
        :for="labelFor" 
        :class="labelFullClass" 
        @click="$emit('click')">

        <span v-html="component.label" />

        <span v-if="required" v-html="required" />
        
        <vl-form-info :component="component" />

        <vl-spinner-icon :loading="loading" />

    </label>

</template>

<script>

import HasId from '../element/mixins/HasId'
import HasConfig from '../element/mixins/HasConfig'

export default {
    mixins: [ HasId, HasConfig],
    props: {
        component: { type: Object, required: true }
    },
    computed: {
        labelFullClass(){
            return 'vlFormLabel' + (this.labelClass ? ' '+this.labelClass : '')
        },
        required(){
            return this.$_config('required')
        },
        labelClass(){
            return this.$_config('labelClass')
        },
        noLabel(){
            return this.$_config('noLabel') || !this.component.label
        },
        loading(){
            return this.component.$_state('loading')
        },
        labelFor(){
            return this.$_elementId() || this.$_elKompoId
        }
    }
}
</script>