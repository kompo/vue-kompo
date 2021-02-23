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

            let classes = className.indexOf(' ') >= 0 ? className.split(' ') : [className]

            classes.forEach( singleClass => {
                if(this.$_classes.split(' ').includes(singleClass)){
                    this.component = Object.assign({}, this.component, {
                        class: this.component.class.replace(singleClass, '')
                    })
                }else{
                    this.component = Object.assign({}, this.component, {
                        class: this.component.class+' '+singleClass
                    })
                }
            })
        }
    }
}
