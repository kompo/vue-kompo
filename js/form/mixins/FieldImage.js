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

                    if(this.$_checkAllImagesLoaded() == Array.from(this.$refs.input.files).length)
                        this.$_changeAction()
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
    },
    created(){
        this.thumbnails = this.$_value
    }
}