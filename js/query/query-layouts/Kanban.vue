<template>
    <div class="w-full">
        <div class="flex space-x-4">
            <div
              v-for="(title, status) in columns"
              :key="status"
              :class="columnClass"
              :style="columnStyle"
            >
                <p v-if="isString(title)"
                    class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
                    v-html="title"/>

                <component v-else v-bind="$_titleAttributes(title)"/>

                <draggable
                    :list="sortedItems[status]" group="column" :animation="200" ghost-class="k-ghost-card"
                    @change="changed(status, $event)"
                    :move="checkConfirm">

                    <component 
                        v-for="(item, index) in sortedItems[status]"
                        :key="itemKey(item)"
                        v-bind="$_attributes(item, index)" 
                    />

                </draggable>
            </div>
        </div>
    </div>
</template>

<script>
import Layout from '../mixins/Layout'
import draggable from 'vuedraggable'

export default {
    mixins: [Layout],
    components: { draggable },
    data(){
        return {
            sortedItems: []
        }
    },
    methods: {
        changed(status, item){

            if(item.added){  
                if(!this.checkConfirm(status, item)){
                    this.$emit('browse')
                    return
                }

                this.fixEmptyColumn(status)                

                this.changeStatus({
                    id: this.itemAttributes(item.added.element).id,
                    status: status
                })
            }

            if(item.removed)            
                this.fixEmptyColumn(status)

            if(item.moved)
                this.changeOrder(this.sortedItems[status])
        },
        checkConfirm(status, item){
            let confirmBefore = this.component.confirmBefore
            if(confirmBefore){

                if(
                    (confirmBefore.status == status) && 
                    this.itemAttributes(item.added.element)[confirmBefore.attribute] &&
                    !confirm(confirmBefore.message)
                )
                    return false

            }
            return true

        },
        changeStatus(payload){
            this.$_kAxios.$_selfPostQuery(payload).then(r => {
                if(this.sortedItems[payload.status].length > 1)
                    this.changeOrder(this.sortedItems[payload.status])
            })
        },
        groupItems(){
            this.sortedItems = _.groupBy(
                _.sortBy(this.items, (item) => this.$_config('item_order', this.itemRender(item))), 
                (item) => this.itemAttributes(item).status 
            )
        },
        fixEmptyColumn(status){
            //remove empty column component
            if(this.sortedItems[status])
                this.sortedItems[status].forEach((item, key) => {
                    if(this.itemAttributes(item).id == 'empty-column')
                        this.sortedItems[status].splice(key, 1)
                })

            //set inexisting statuses to empty column component
            if(!this.sortedItems[status] || !this.sortedItems[status].length)
                this.$set(this.sortedItems, status, [this.emptyColumn]) 
        },
        isString(val){
            return _.isString(val)
        },
        $_titleAttributes(component) {
            return {
                is: this.$_vueTag(component),
                vkompo: component,
                //kompoid: this.kompoid, //not needed yet
            }
        },
    },
    computed: {
        columns(){ return this.component.columns },
        columnClass(){ return this.component.columnClass },
        columnStyle(){ return this.component.columnStyle },
        emptyColumn(){ return this.createItemFromRender(this.component.emptyColumn, {id: 'empty-column'}) },
    },
    created(){
        this.groupItems()

        Object.keys(this.columns).forEach((status) => { 
            this.fixEmptyColumn(status)
        })
    }
}
</script>
