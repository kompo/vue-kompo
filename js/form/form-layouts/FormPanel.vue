<template>
    <div 
        v-show="!$_hidden" 
        v-bind="$_layoutWrapperAttributes">

        <div v-if="showCloseButton" class="vlPanelClose" v-html="closable" @click="close" />
        
        <transition :name="transition" :mode="mode">
            <div v-if="html" :is="{template: html}" />
            <template v-for="(row,index) in elements">
                <component 
                    v-bind="$_attributes(row)" 
                    @closeModal="closeModal"
                    @closePanel="reset"
                    @confirmModal="confirmModal"
                    @touchedForm="$emit('touchedForm')"  
                />
            </template>
        </transition>


    </div>
</template>

<script>
import Layout from '../mixins/Layout'
export default {
    mixins: [Layout],
    data(){
        return {
            html : null,
        }
    },
    computed:{
        $_customLayoutAttributes(){
            return {
                transition: this.$_config('transition'),
                mode: this.$_config('transitionMode'),
                closable: this.$_config('closable'),
            }
        },
        hidesOnLoad(){
            return this.component.$_config('hidesOnLoad') // this.$_config(...) not working... ??
        },
        transition(){ return this.$_config('transition') || 'fadeIn'},
        mode(){ return this.$_config('transitionMode') || (this.transition == 'fadeIn' ? 'out-in' : '')},
        closable(){ return this.$_config('closable')},
        showCloseButton(){
            return this.closable && this.hasLoadedElements
        },
        $_customClassArray(){
            return [
                this.hasLoadedElements ? 'vlPanelNotEmpty' : ''
            ]
        },
        hasLoadedElements(){
            return this.elements && this.elements.length > 0
        }
    },
    methods:{
        reset(){
            this.html = null
            this.elements = []
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
        loadPanel(elements){
            
            //TODO: append or replace elements...
            
            if(!_.isArray(elements) && !_.isObject(elements))
                return //should be object or array. If not, it's dump most probably

            elements = _.isArray(elements) ? elements : [elements]

            this.elements.push(... elements) //set reactively
        },
        revertPanel(){
            this.$_togglesForm(this.hidesOnLoad)
            this.reset()
        },
        includeObject(object){
            this.reset()
            this.$nextTick( () => {
                this.loadPanel(object)
                this.$nextTick( () => { this.$_togglesForm(this.hidesOnLoad) })
            })
        },

        $_attachCustomEvents(){
            this.$_vlOn('vlFillPanel' + this.$_elementId(), (response, included) => {

                this.reset()

                if(included)
                    return this.includeObject(response) //emit and stop

                this.$nextTick(() => {
                    if(!_.isString(response)){

                        this.elements = _.isArray(response) ? response : [response] //Array when getElements() is used, non-array when a single Element is returned

                    }else{
                        this.html = response
                    }
                })
            })
        },
        $_destroyCustomEvents(){
            this.$_vlOff([
                'vlFillPanel' + this.$_elementId()
            ])
        },
    },
    created() {

        this.elements = this.elements || [] //when called in Vue directly (not through a PHP Form)
        
        this.loaded = this.elements && this.elements.length
    }
}
</script>
