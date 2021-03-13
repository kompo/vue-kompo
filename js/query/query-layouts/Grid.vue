<template>
    <div class="row" :class="rowClass">
    	<component 
            v-for="(item, index) in items"
            :key="itemKey(item)"
            v-bind="$_attributes(item, index)" 
        />
    </div>
</template>

<script>
import Layout from '../mixins/Layout'

export default {
    mixins: [Layout],
    computed: {
    	rowClass(){ return this.component.rowClass }
    }
}
</script>
