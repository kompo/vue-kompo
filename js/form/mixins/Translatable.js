export default {
    data(){
        return {
            activeLocale: this.vkompo.config.locales[0],
            currentTranslation: ''
        }
    },
    computed: {
        $_attributes(){
            return {
                ...this.$_defaultFieldAttributes,
                rows: this.$_config('rows') || 3
            }
        },
        locales(){
            return this.$_config('locales')
        },
        currentLocale(){
            return this.$_config('currentLocale')
        },
        $_pristine() {
            return !this.currentTranslation
        },

        $_isEmpty(){
            return _.values(this.$_value).every(_.isEmpty)
        },
    },
    methods: {
        $_inputAction(){
            this.component.value[this.activeLocale] = this.currentTranslation
            this.$_changeAction()
            this.$emit('change', this.$_value)
        },
        changeTab(locale) {
            this.activeLocale = locale
            this.currentTranslation = this.$_value[this.activeLocale]
            this.$nextTick(() => {
                if (this.component.trix) {
                    this.$refs.content.update()
                } else {
                    this.$refs.content.focus ? 
                        this.$refs.content.focus():
                        this.$refs.content.$_instance.editing.view.focus()         
                }
            })
        },
        
        $_fill(jsonFormData){
            
            if (this.$_isEmpty) {
                jsonFormData[this.$_name] = ''
            } else {
                this.$_fillValues(jsonFormData)
            }
            
        },

        $_fillValues(jsonFormData){
            Object.keys(this.$_value).forEach(key => {
                if(this.$_value[key]){
                    jsonFormData[this.$_name+'['+key+']'] = this.$_value[key]
                }
            })
        }
    },
    created(){
        this.activeLocale = this.currentLocale
        this.currentTranslation = this.$_value[this.activeLocale]
    }
}