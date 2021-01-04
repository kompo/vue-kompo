<template>
    <div class="w-full overflow-x-auto">
        <div class="flex">
            <div
              v-for="(title, status) in columns"
              :key="status"
              class="mr-4"
            >
                <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
                    v-html="title"/>

                <draggable
                    :list="sortedItems[status]" group="column" :animation="200" ghost-class="VlGhostCard"
                    @change="changed(status, $event)">

                    <template v-for="(item, index) in sortedItems[status]">

                        <component v-bind="$_attributes(item, index)" />

                    </template>

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
            if(item.added)
                this.changeStatus({
                    id: this.itemAttributes(item.added.element).id,
                    status: status
                })
        },
        changeStatus(payload){
            this.$_kAxios.$_selfPostQuery(payload).then(r => {
                //this.groupItems()
            })
        },
        groupItems(){
            this.sortedItems = _.groupBy(this.items, (item) => this.itemAttributes(item).status )

            //set inexisting statuses to empty array
            Object.keys(this.columns).forEach((status) => { 
                if(!this.sortedItems[status])
                    this.sortedItems[status] = [] 
            })
        }
    },
    computed: {
        columns(){
            return this.component.columns
        }
    },
    mounted(){
        this.groupItems()
    }
}
</script>
<style lang="scss">
.VlGhostCard{
    opacity: 0.5;
    background: #F7FAFC;
    border: 1px dashed gainsboro;
}
</style>
