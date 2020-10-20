<template>
    <tr 
        v-bind="$_cardWrapperAttributes"
        @click="$_clickAction">
        <template v-for="(component,k) in $_props">
            <td :key="k" v-if="$_vueTag(component)" >
                <component 
                	v-bind="componentAttributes(component)"
                    @activate="activate" />
            </td>
        </template>
    </tr>
</template>

<script>
import Card from '../mixins/Card'

export default {
    mixins: [Card],
    computed: {
        $_activeClass(){ return this.active ? 'vlActive' : '' },
        $_customClassArray() { return [
            this.$_activeClass
        ] },
    }
}
</script>
