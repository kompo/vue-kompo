<template>
    
    <div :id="id" :class="panelClass">

        <div v-if="showCloseButton" class="vlPanelClose" v-html="closable" @click="close" />
        
        <transition :name="usedTransition" :mode="usedMode">
            <slot />
            <div v-if="html" :is="{template: html}" />
            <template v-for="(row,index) in komponents">
                <component 
                    v-bind="$_attributes(row)" 
                    @closeModal="closeModal"
                    @closePanel="reset"
                    @confirmModal="confirmModal"
                />
            </template>
        </transition>
        
    </div>

</template>

<script>
import HasKomponents from '../../form/mixins/HasKomponents'
import EmitsEvents from '../mixins/EmitsEvents'
import HasClasses from '../mixins/HasClasses'

export default {
    mixins: [HasKomponents, EmitsEvents, HasClasses],
    props: {
        id: { type: String, required: true },
        transition: { type: String },
        mode: { type: String },
        closable: { type: String }
    },
    data(){
        return {
            html : null,
            component: {},
            usedTransition: null,
            usedMode: null
        }
    },
    computed: {
        showCloseButton(){
            return this.closable && this.hasLoadedKomponents
        },
        panelClass(){
            return this.$_classString([
                'vlPanel',
                this.hasLoadedKomponents ? 'vlPanelNotEmpty' : ''
            ])
        },
        hasLoadedKomponents(){
            return this.komponents && this.komponents.length > 0
        }
    }, 
    methods: {
        reset(){
            this.component = {}
            this.html = null
            this.partial = null
            this.komponents = []
        },
        close(){
            this.reset()
        },
        closeModal(){
            this.$emit('closeModal')
        },
        confirmModal(){
            this.$emit('confirmModal')
        },
        $_attachEvents(){
            this.$_vlOn('vlFillPanel' + this.id, (response, included) => {

                this.reset()

                if(included)
                    return this.$emit('includeObj', response) //emit and stop

                this.$nextTick(() => {
                    if(!_.isString(response)){

                        this.komponents = _.isArray(response) ? response : [response] //Array when getKomponents() is used, non-array when selfGet returns a single Komponent

                    }else{
                        this.html = response
                    }
                    this.$emit('loaded')
                })
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
