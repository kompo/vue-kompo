<template>
    <footer>
        <slot />
    </footer>
</template>

<script>
import HasConfig from '../element/mixins/HasConfig'
import IsKomposer from '../mixins/IsKomposer'

export default {
    mixins: [HasConfig, IsKomposer],
    props:{
    },
    data(){
        return {
        }
    },
    methods:{
    }
}
</script>