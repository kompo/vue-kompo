<template>
    <tbody>
    	<component 
            v-for="(item, index) in items"
            :key="itemKey(item)"
            v-bind="$_attributes(item, index)" 
            @activate="activate"
        />
    </tbody>
</template>

<script>
import Layout from '../mixins/Layout'

export default {
    mixins: [Layout]
}
</script>
