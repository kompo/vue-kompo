export default {
    computed:{
        $_customClassArray(){
            return [
                'row',
                this.$_config('alignClass'),
                this.$_config('guttersClass')
            ]
        },
        numOfColumns(){
            return this.komponents.length
        },
        equalColumnClass(){
            return 12 % this.numOfColumns == 0 ? 
                ('col-'+(this.breakpoint ? this.breakpoint+'-' : '')+parseInt(12/this.numOfColumns)) : 
                'col'
        },
        breakpoint(){
            return this.$_config('breakpoint')
        }
    },
    methods:{
        colClasses(col){
            return this.$_classString([
                this.colClass(col),
            ])
        },
        colClass(col){
            return this.$_config('col', col) || this.equalColumnClass
        }
    }
}