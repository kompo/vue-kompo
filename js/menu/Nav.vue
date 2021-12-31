<template>
    <nav v-bind="$_menuAttributes">
        <template v-for="element in elements">
            <component v-bind="$_attributes(element)"/>
        </template>
    </nav>
</template>

<script>
import IsMenu from './mixins/IsMenu'

export default {
    mixins: [IsMenu],
}
</script>