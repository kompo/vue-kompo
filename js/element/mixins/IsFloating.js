import HasVueComponent from './HasVueComponent'

export default {
    mixins: [HasVueComponent],
    props: {
        obj: { type: Object|Array, required: true },
        kompoid: { type: String, required: true },
        options: { type: Object, default: {} },
    },
    data(){
        return {
            elements: [],
            readyToClose: false,
            isDirty: false,
        }
    },
    computed: {
        arrows(){ return this.options.arrows },
        zIndex(){ return this.options.zIndex },
        warnBeforeClose(){ return this.options.warnBeforeClose },
        closeAfterSubmit(){ return this.options.closeAfterSubmit },
        refreshParent(){ return this.options.refreshParent },
        updateSelectOption(){ return this.options.updateSelectOption },
    },
    methods:{
        isOutside(e){
            if(!this.$refs.floatingContainer){ //handle double click, the ref doesn't exist at the second click
                return false
            }

            return !e.target.classList.contains('kompoFloat') && !this.$refs.floatingContainer.contains(e.target)
        },
        mouseDown(e){
            if (this.isOutside(e)){
                this.readyToClose = true
            }

            e.stopPropagation() //so that parent modals/drawers don't close too
        },
        mouseUp(e){
            if (this.isOutside(e) && this.readyToClose){
                if(this.canClose()){
                    this.closeAction()
                }else{
                    this.readyToClose = false
                }
            }

            e.stopPropagation() //so that parent modals don't close too
        },
        closeAction(){
            if (this.canClose())
                this.$emit('close')
        },
        canClose(){ 
            const result = !this.warnBeforeClose || (this.warnBeforeClose && !this.isDirty) || (this.warnBeforeClose && confirm(this.warnBeforeClose))

            return result
        },
        confirmSubmit(){
            this.closeAction()
            this.$emit('confirmSubmit')
        },
        handleTouchedForm(){
            this.isDirty = this.warnBeforeClose ? true : false
        },
        next(){
            if(this.arrows)
                this.$emit('next')
        },
        previous(){
            if(this.arrows)
                this.$emit('previous')
        },
        $_attributes(component) {
            return {
                key: component.id,
                is: this.$_vueTag(component),
                vkompo: component,
                kompoid: this.kompoid,
            }
        },
        handleSubmitSuccess(response){
            if(this.refreshParent){
                this.$kompo.vlReloadAfterChildAction(this.kompoid, response)
            }
            if(this.updateSelectOption){
                this.$kompo.vlUpdateSelectOption(this.kompoid, response)
            }
            if (this.closeAfterSubmit) {
                this.closeAction()
            }
        },
    },
    created() {
        this.elements = _.isArray(this.obj) ? this.obj : [this.obj]
    }
}