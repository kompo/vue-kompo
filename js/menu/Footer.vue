<template>
    <footer v-bind="$_menuAttributes">
        <template v-for="component in elements">
            <component v-bind="$_attributes(component)"/>
        </template>
    </footer>
</template>

<script>
import IsMenu from './mixins/IsMenu'

export default {
    mixins: [IsMenu],
}
</script>