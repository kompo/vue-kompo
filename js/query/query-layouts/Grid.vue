<template>
    <div class="row">
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
    mixins: [Layout]
}
</script>
