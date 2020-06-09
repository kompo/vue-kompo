export default {
    computed:{
        $_customClassArray(){
            return [
                'row',
                this.$_data('alignClass'),
                this.$_data('guttersClass')
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
            return this.$_data('breakpoint')
        }
    },
    methods:{
        colClasses(col){
            return this.$_classString([
                this.colClass(col),
            ])
        },
        colClass(col){
            return this.$_data('col', col) || this.equalColumnClass
        }
    }
}