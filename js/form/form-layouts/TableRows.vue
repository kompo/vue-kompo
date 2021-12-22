<template>
    <tr 
    	v-bind="$_layoutWrapperAttributes" 
    	v-show="!$_hidden"
        @click="$_clickAction">
        <td v-for="(row,index) in elements"
            :class="tdClass(row)">
            <component 
                v-bind="$_attributes(row)" 
                @deleted="$emit('deleted')"/>
        </td>
    </tr>
</template>

<script>
import Layout from '../mixins/Layout'

export default {
    mixins: [Layout],
    methods: {
        tdClass(row){
            return this.$_config('tdClass', row)
        }
    },
}
</script>
