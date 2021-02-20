<template>
    <draggable 
        v-bind="$_sortingAttributes" 
        v-on="$_sortingEvents">

        <component 
            v-for="(item, index) in items"
            :key="itemKey(item)"
            v-bind="$_attributes(item, index)"
            @activate="activate(index, $event)"
        />

    </draggable>
</template>

<script>
import Layout from '../mixins/Layout'
import draggable from 'vuedraggable'

export default {
    mixins: [Layout],
    components: { draggable }
}
</script>
