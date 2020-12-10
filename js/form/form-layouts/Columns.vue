<template>
    <div 
    	v-bind="$_layoutWrapperAttributes" 
    	v-show="!$_hidden"
        @click="$_clickAction">
        <div v-for="(col,index) in komponents"
            :key="index"
            :class="colClasses(col)">
            <component 
                v-bind="$_attributes(col)" />
        </div>
    </div>
</template>

<script>
import Layout from '../mixins/Layout'
import HasColumns from '../mixins/HasColumns'

export default {
    mixins: [Layout, HasColumns]
}
</script>
