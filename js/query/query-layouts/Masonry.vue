<template>
    <div class="vlMasonry">
        <div v-masonry transition-duration="0.3s" item-selector=".item">
            <component 
                v-for="(item, index) in items"
                :key="itemKey(item)"
                v-bind="$_attributes(item, index)" 
                v-masonry-tile 
                class="item"
            />
        </div>
    </div>
</template>

<script>
import Layout from '../mixins/Layout'

export default {
    mixins: [Layout],
    methods:{
        
    }
}
</script>
