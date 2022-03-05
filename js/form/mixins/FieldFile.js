import Field from './Field'
import SetInitialValueAsArray from './SetInitialValueAsArray'

export default {
    mixins: [Field, SetInitialValueAsArray],
    computed: {
        $_attributes() {
            return {
                ...this.$_defaultFieldAttributes,
                multiple: this.$_multiple || false,
            }
        },
        $_events(){
            return {
                ...this.$_defaultFieldEvents,
                change: this.addFile,
                blur: ()=>{} //do nothing //otherwise it blurs on open
            }
        },
        $_pristine() {
            return this.$_value.length == 0
        },
        $_getFiles(){
            //return Array.from(this.$refs.input.files)
            //Does not work because computed caches the refs....
        }
    },
    methods: {
        $_addRefFiles(){
            Array.from(this.$refs.input.files).forEach( file => {
                this.$_addFileToValue( file )
            })
        },
        $_addFileToValue(file){
            this.$_multiple ? this.component.value.push(file) : this.component.value = [file]
        },
        $_fill(jsonFormData) {
            
            /* You can only send string or File in FormData, so null becomes "null"
            if(!this.$_value.length)
                jsonFormData[this.$_name + (this.$_multiple ? '[]' : '')] = null*/

            this.$_value.forEach( (file, i) => this.$_fillJsonData(jsonFormData, file, i))
        },
        $_fillJsonData(jsonFormData, file, i) {
            var name = this.$_name + (this.$_multiple ? '['+i+']' : '')
                
            if(file.id){
                jsonFormData[name]= JSON.stringify(file)
            }else{
                jsonFormData[name]= file 
            } 
        }
    },
}