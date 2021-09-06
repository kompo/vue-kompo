<template>
<div v-if="hasSlidingPanels"
     class="vlSlidingPanels"
     @click="close" >
    <div ref="panelContainer" class="vlPanelContainer">
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
import EmitsEvents from '../mixins/EmitsEvents'

export default {
    mixins: [EmitsEvents],
    data(){
        return {
            slides : [],
            initialId: 0,
            hasSlidingPanels: 0, //I had to decouple it for the transition effect to work
            warnBeforeClose: false,
        }
    },
    computed:{
        /*hasSlidingPanels(){ //I had to decouple it for the transition effect to work
            return this.slides.length
        }*/
    },
    methods:{
        outsideModal(e){
          if(!this.$refs.panelContainer)
            return false

          return !e.target.classList.contains('vlPanelContainer')
              && !this.$refs.panelContainer.contains(e.target)
        },
        warnConfirmation(){ 
            return !this.warnbeforeclose || (this.warnbeforeclose && confirm(this.warnbeforeclose))
        },
        close(e){
            if (this.outsideModal(e)){
                if(this.warnConfirmation()){
                    this.closeByIndex(this.slides.length-1)
                }
            }
        },
        closeById(id){
            var indexWithId = _.findIndex(this.slides, (slide) => slide.id == id)
            this.closeByIndex(indexWithId)
        },
        closeByIndex(index){
            this.slides.splice(index)
            this.hasSlidingPanels = this.slides.length
        },
        addSlidingPanel(obj){
            this.initialId += 1

            this.hasSlidingPanels = Math.max(this.slides.length, 1)
            
            this.$nextTick(() => this.slides.push({
                id: 'vl-sliding-panel-'+this.initialId,
                obj: obj
            }))
        },
        $_attachEvents(){
            this.$_vlOn('vlFillSlidingPanel', (response, warnbeforeclose) => {
                this.warnbeforeclose = warnbeforeclose || false
                this.addSlidingPanel(response.data)
            })
            this.$_vlOn('vlCloseSlidingPanel', () => {
                this.closeByIndex(this.slides.length-1)
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
              'vlFillSlidingPanel',
              'vlCloseSlidingPanel'
            ])
        }

    },
    created(){
        this.$_destroyEvents()
        this.$_attachEvents()
    },
    updated() {
        this.$_destroyEvents()
        this.$_attachEvents()
    }
}
</script>
