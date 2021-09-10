<template>
    <nav v-bind="$_menuAttributes">
        <slot />
        <vl-support-modal 
            :kompoid="$_elKompoId"
        />
    </nav>
</template>

<script>
import IsMenu from './mixins/IsMenu'

export default {
    mixins: [IsMenu],
}
</script>