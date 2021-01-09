export default {
    methods: {
        //obj is almost always null unless we are calling the function on another object. It's useful when a parent wants info on their child's data for example => see TableRows
        $_config(config, obj){
            obj = obj || this.component
            if(_.isObject(config)){
                this.$set(obj, 'config', Object.assign(obj.config, config))
            }else{
                return _.get(obj, 'config.' + config)
            }
        }
    }
}
