import FieldFile from './FieldFile'

export default {
    mixins: [FieldFile],
    data(){
        return {
            thumbnails: null
        }
    },
    methods: {
        $_makeFileImages(){
            Array.from(this.$refs.input.files).forEach( file => {
                let reader = new FileReader()
                reader.readAsDataURL(new File([file], file.name, {type: file.type}))
                reader.onload = () => { 

                    this.$_addFileToValue(file)
                    
                    this.$_addImageToThumbnails(Object.assign(file, {src: reader.result}))

                    if(this.$_checkAllImagesLoaded() == this.thumbnails.length){
                        this.$_changeAction()
                    }
                }
            })
        },
        $_checkAllImagesLoaded(){
            let check = 0
            this.thumbnails.forEach( image => {
                if(image.src)
                    check += 1
            })
            return check
        },
        $_addImageToThumbnails(file){
            this.$_multiple ? this.thumbnails.push(file) : this.thumbnails = [file]
        },
        remove(index) {
            if(this.$_config('confirmDelete') && !confirm(this.$_config('confirmDelete')))
                return

            this.removeFromValue(index)
            this.$_changeAction()
        },
        removeFromValue(index){
            this.thumbnails.splice( index, 1)
            this.component.value.splice( index, 1)    
            this.$_blurAction()        
        },
        $_handleError(error, index){ //when the _Image() auto-submits, we want to remove the thumb if the image was not set
            if (this.$_multiple)
                return

            index = index || 0
            this.removeFromValue(index) //on Error: remove thumbnail, but don't trigger changeAction
        },
    },
    created(){
        this.thumbnails = this.$_value ? _.cloneDeep(this.$_value) : []
    }
}