<template>
    <div v-bind="$_layoutWrapperAttributes" v-show="!$_hidden">
        <template v-for="(row,index) in komponents">
            <div>
                <component v-bind="$_attributes(row)" />
            </div>
        </template>
    </div>
</template>

<script>
import Layout from '../mixins/Layout'

export default {
    mixins: [Layout]
}
</script>
