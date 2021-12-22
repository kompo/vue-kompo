<template>
<div v-if="hasDrawers"
     class="vlDrawers"
     @click="close" >
    <div ref="panelContainer" class="vlPanelContainer">
      <transition-group name="slideLeft">
          <vl-drawer
              v-for="(slide, key) in slides"
              :obj="slide.obj"
              :kompoid="slide.kompoid"
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
            hasDrawers: 0, //I had to decouple it for the transition effect to work
            warnBeforeClose: false,
        }
    },
    computed:{
        /*hasDrawers(){ //I had to decouple it for the transition effect to work
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
            this.hasDrawers = this.slides.length
        },
        addDrawer(obj, kompoid){
            this.initialId += 1

            this.hasDrawers = Math.max(this.slides.length, 1)
            
            this.$nextTick(() => this.slides.push({
                id: 'vl-drawer-'+this.initialId,
                obj: obj,
                kompoid: kompoid,
            }))
        },
        $_attachEvents(){
            this.$_vlOn('vlFillDrawer', (response, kompoid, warnbeforeclose) => {
                this.warnbeforeclose = warnbeforeclose || false
                this.addDrawer(response.data, kompoid)
            })
            this.$_vlOn('vlCloseDrawer', () => {
                this.closeByIndex(this.slides.length-1)
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
              'vlFillDrawer',
              'vlCloseDrawer'
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
