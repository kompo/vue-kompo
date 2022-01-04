<template>
    <transition :name="transition" :mode="mode">
        <div 
            v-if="hasElements"
            v-show="!$_hidden" 
            v-bind="$_layoutWrapperAttributes">

            <div v-if="showCloseButton" class="vlPanelClose" v-html="closable" @click="close" />
            
            <div v-if="html" :is="{template: html}" />
            <component 
                v-for="(row,index) in elements" :key="componentKey(index)"
                v-bind="$_attributes(row)" 
                @closeModal="closeModal"
                @closePanel="reset"
                @confirmSubmit="confirmSubmit"
                @touchedForm="$emit('touchedForm')"  
                @success="handleSubmitSuccess"
            />


        </div>
    </transition>
</template>

<script>
import Layout from '../mixins/Layout'
export default {
    mixins: [Layout],
    data(){
        return {
            html : null,
            loaded: false,
            refreshParent: false,
            resetAfterSubmit: false,
        }
    },
    computed:{
        $_customLayoutAttributes(){
            return {
                closable: this.$_config('closable'),
            }
        },
        hidesOnLoad(){
            return this.component.$_config('hidesOnLoad') // this.$_config(...) not working... ??
        },
        transition(){
            return this.$_config('transition') || 'fadeIn' 
        },
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
            return this.loaded && this.hasElements
        },
        hasElements(){
            return this.elements && this.elements.length > 0
        }
    },
    methods:{
        reset(){
            this.html = null
            this.elements = []
            this.loaded = false
        },
        componentKey(key){ return this.$_elKompoId + '-' + key },
        close(){
            this.reset()
        },
        closeModal(){
            this.$emit('closeModal')
        },
        confirmSubmit(){
            this.$emit('confirmSubmit')
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
            this.$nextTick( () => {
                this.loadPanel(object)
                this.$nextTick( () => { this.$_togglesForm(this.hidesOnLoad) })
            })
        },

        handleSubmitSuccess(response){
            console.log(this.kompoid, response)
            if(this.refreshParent){
                this.$kompo.vlReloadAfterChildAction(this.kompoid, response)
            }
            if (this.resetAfterSubmit) {
                this.reset()
            }
        },

        $_attachCustomEvents(){
            this.$_vlOn('vlFillPanel' + this.$_elementId(), (response, options) => {

                this.reset()

                this.loaded = true
                this.refreshParent = options.refreshParent
                this.resetAfterSubmit = options.resetAfterSubmit

                if(options.included)
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
    }
}
</script>
