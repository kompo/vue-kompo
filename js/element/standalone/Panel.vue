<template>
    
    <div :id="id" class="vlPanel">
        
        <transition :name="usedTransition" :mode="usedMode">
            <slot />
            <div v-if="html" :is="{template: html}" />
            <component 
                v-if="partial" :is="partial" 
                :vkompo="component" 
                :key="panelKey" />
        </transition>
        
    </div>

</template>

<script>
import HasVueComponent from '../mixins/HasVueComponent'
import EmitsEvents from '../mixins/EmitsEvents'

export default {
    mixins: [HasVueComponent, EmitsEvents],
    props: {
        id: { type: String, required: true },
        transition: { type: String },
        mode: { type: String }
    },
    data(){
        return {
            html : null,
            component: null,
            partial: null,
            panelKey: 0,
            usedTransition: null,
            usedMode: null
        }
    },
    methods: {
        $_attachEvents(){
            this.$_vlOn('vlFillPanel' + this.id, (response, included) => {
                this.component = null
                this.html = null
                this.partial = null

                if(included)
                    return this.$emit('includeObj', response) //emit and stop

                if(!_.isString(response)){
                    this.partial = this.$_getKomposerTemplate(response)
                    this.component = response
                    this.panelKey += 1
                }else{
                    this.html = response
                }
                this.$emit('loaded')
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
                'vlFillPanel' + this.id
            ])
        }
    },
    created(){

        this.usedTransition = this.transition || 'fadeIn'
        this.usedMode = this.mode || (this.usedTransition == 'fadeIn' ? 'out-in' : '')

        this.$_destroyEvents()
        this.$_attachEvents()
    },
    updated() {
        this.$_destroyEvents()
        this.$_attachEvents()
    }
}
</script>
