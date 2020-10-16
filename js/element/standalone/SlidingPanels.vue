<template>
<div v-if="hasSlidingPanels" class="fixed inset-0 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
        <transition-group name="slideLeft">
            <vl-sliding-panel
                v-for="(slide, key) in slides"
                :obj="slide.obj"
                :index="slide.id"
                :key="slide.id"
                @close="closeById" />
        </transition-group>
    </div>
</div>
</template>

<script>

export default {
    data(){
        return {
            slides : [],
            zIndex: 2200, //lower than Alerts 2500
            initialId: 0,
            hasSlidingPanels: 0 //I had to decouple it for the transition effect to work
        }
    },
    computed:{
        /*hasSlidingPanels(){ //I had to decouple it for the transition effect to work
            return this.slides.length
        }*/
    },
    methods:{
        closeById(id){
            var indexWithId = _.findIndex(this.slides, (slide) => slide.id == id)
            this.slides.splice(indexWithId)
            this.hasSlidingPanels = this.slides.length
        },
        addSlidingPanel(obj){
            this.initialId += 1

            this.hasSlidingPanels = Math.max(this.slides.length, 1)
            
            this.$nextTick(() => this.slides.push({
                id: 'vl-sliding-panel-'+this.initialId,
                obj: obj
            }))
        }
    },
    mounted(){
        this.$kompo.events.$on('vlFillSlidingPanel', (response) => {
            this.addSlidingPanel(response.data)
        })
    }
}
</script>
