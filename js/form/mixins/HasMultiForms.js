export default {
    created(){
        this.elements.forEach( item => {
            item.key = this.getRandomKey()
        })
    },
    computed: {
        noAdding(){ return this.$_config('noAdding') },
        topAdding(){ return this.$_config('topAdding') },
    },
    methods:{
        getRandomKey(){
            return 'multiform-'+Math.random()
        },
        addRow(payload){
            if(this.noAdding)
                return
            
            this.$_kAxios.$_loadKomponent(payload).then(r => {

                let newElement = Object.assign(r.data, {key: this.getRandomKey()})

                if (this.topAdding) {

                    this.elements.unshift(newElement)

                }else {

                    this.elements.push(newElement)

                }

            })
        },
        $_validate(errors) {

            var ownErrors = _.pickBy(errors, (value, key) => {
                return _.startsWith(key, this.$_name+'.')
            })

            this.elements.forEach( (form,k) => {
                var formErrors = _.mapKeys(_.pickBy(ownErrors, (value, key) => {
                    return _.startsWith(key, this.$_name+'.'+k+'.')
                }), (value, key) => {
                    return key.replace(this.$_name+'.'+k+'.', '')
                })
                form.$_validate(formErrors)
            })            
        },
        $_fillRecursive(jsonFormData){
            if(this.$_hidden)
                return 

            var name = this.$_name, results = [] 
            this.elements.forEach( (item,k) => {
                var json = {}
                item.$_fillRecursive(json)
                if(item.multiFormKey)
                    json.multiFormKey = item.multiFormKey
                results.push(json)
            })
            results.forEach( (form, k) => {
                Object.keys(form).forEach( (key) => {
                    let formDataKey = key.split(/\[(.+)/)
                    formDataKey = formDataKey.length == 1 ? 
                            ('['+formDataKey[0]+']') : //if key='smth' => [smth]
                            ('['+formDataKey[0]+'][' + formDataKey[1]) //if key='smth[0]' => [smth][0]

                    jsonFormData[name+'['+k+']'+formDataKey] = form[key]
                })
            })
        },
        deleteRow(index){
            this.$delete(this.elements, index)
        },
        revertFormRow(childId){
            var rowToDelete
            this.elements.forEach( (item, k) => {
                if(item.$_getPathById(childId))
                    rowToDelete = k
            })
            if(rowToDelete || rowToDelete === 0)
                this.$delete(this.elements, rowToDelete)
        }
    }
}