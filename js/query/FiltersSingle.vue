<template>
    <component 
        v-if="filters.length" 
        :class="'vlFilters'+placement"
        :is="$_vueTag(filters[0])"
        :vkompo="filters[0]"
        :kompoid="kompoid"
    />
</template>

<script>
import HasVueComponent from '../element/mixins/HasVueComponent'

export default {
    mixins: [HasVueComponent],

    props: {
        filters: { type: Array, required: true },
        kompoid: { type: String, required: true },
        placement: {type: String, required: true }
    },

    methods: {
        filterPlacement(){
            return 'vlFilters'+this.placement
        }
    }
}

</script>
