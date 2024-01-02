<template>
    
    <div :id="id" :class="panelClass">

        <div v-if="showCloseButton" class="vlPanelClose" v-html="closable" @click="close" />
        
        <transition :name="usedTransition" :mode="usedMode">
            <slot />
            <div v-if="html" :is="{template: html}" />
            <template v-for="(row,index) in elements">
                <component 
                    v-bind="$_attributes(row)" 
                    @closeModal="closeModal"
                    @closePanel="reset"
                    @confirmSubmit="confirmSubmit"
                    @touchedForm="$emit('touchedForm')"  
                />
            </template>
        </transition>
        
    </div>

</template>

<script>
import HasElements from '../../form/mixins/HasElements'
import EmitsEvents from '../mixins/EmitsEvents'
import HasClasses from '../mixins/HasClasses'

export default {
    mixins: [HasElements, EmitsEvents, HasClasses],
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
            return this.closable && this.hasLoadedElements
        },
        panelClass(){
            return this.$_classString([
                'vlPanel',
                this.hasLoadedElements ? 'vlPanelNotEmpty' : ''
            ])
        },
        hasLoadedElements(){
            return this.elements && this.elements.length > 0
        }
    }, 
    methods: {
        reset(){
            this.component = {}
            this.html = null
            this.partial = null
            this.elements = []
        },
        close(){
            this.reset()
        },
        closeModal(){
            this.$emit('closeModal')
        },
        confirmSubmit(){
            this.$emit('confirmSubmit')
        },
        $_attachEvents(){
            this.$_vlOn('vlFillPanel' + this.id, (response, included) => {

                this.reset()

                if(included)
                    return this.$emit('includeObj', response) //emit and stop

                this.$nextTick(() => {
                    if(!_.isString(response)){

                        this.elements = _.isArray(response) ? response : [response] //Array when getElements() is used, non-array when a single Element is returned

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
