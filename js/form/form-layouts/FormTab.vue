<template>
    <section 
        v-if="!isDisabled"
        :aria-hidden="!activeTab"
        v-show="activeTab"
        v-bind="$_layoutWrapperAttributes" 
        class="vlTab"
        role="tabpanel">

        <component 
            v-bind="$_attributes(tab)"
            v-for="(tab,index) in elements"
            :key="index" />

    </section>
</template>

<script>
import Layout from '../mixins/Layout'

export default {
    mixins: [Layout],
    props: {
        activeTab: { type: Boolean, required: true },
    },
    computed: {
        isDisabled(){
            return this.$_config('tabDisabled')
        },
    },
}
</script>
