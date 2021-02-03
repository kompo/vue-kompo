export default {
    computed: {
        $_phpClasses() { return this.component.class || '' },
        $_customClassArray() { return [] }, //to be overridden in Komponents
        $_classes() {
        	return this.$_classString(
                    [ this.$_defaultCssClass() ]
                        .concat(this.$_customClassArray)
                        .concat(this.$_phpClasses)
                )
        }
    },
    methods: {
        $_classString(classes){
            return classes.filter(n => n).join(' ')
        },
        $_defaultCssClass(component) {
            return 'vl'+(component || this.$_vueComponent())
        },
        $_toggleClass(className){
            if(this.$_classes.split(' ').includes(className)){
                this.component = Object.assign({}, this.component, {
                    class: this.component.class.replace(className, '')
                })
            }else{
                this.component = Object.assign({}, this.component, {
                    class: this.component.class+' '+className
                })
            }
        }
    }
}
