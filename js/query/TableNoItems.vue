<template>
    <tbody>
        <tr class="text-center">
            <td v-if="$_noItemsAsHtml" :colspan="headers.length" v-html="$_noItemsFound" />
            <td v-else :colspan="headers.length">
                <component v-bind="$_noItemsAttributes" />
            </td>
        </tr>
    </tbody>
</template>

<script>
import NoItems from './mixins/NoItems'

export default {
    mixins: [NoItems],
    computed: {
        headers(){ return this.vkompo.headers }
    }
}
</script>
