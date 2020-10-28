export default {
    methods: {
        //obj is almost always null unless we are calling the function on another object. It's useful when a parent wants info on their child's data for example => see TableRows
        $_data(data, obj){
            obj = obj || this.component
            if(_.isObject(data)){
                this.$set(obj, 'data', Object.assign(obj.data, data))
            }else{
                return _.get(obj, 'data.' + data)
            }
        }
    }
}
