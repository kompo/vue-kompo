export default {
    computed:{
        $_selectedClass(){ return this.$_config('selectedClass') || 'vlSelected' },
        $_unselectedClass(){ return this.$_config('unselectedClass') || '' },
        $_commonClass(){ return this.$_config('commonClass') || '' },
    },
    methods:{

    }
}