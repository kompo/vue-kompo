import Element from '../../element/mixins/Element'
import DoesAxiosRequests from '../../form/mixins/DoesAxiosRequests'

export default {
    mixins: [ Element, DoesAxiosRequests ],
    props: {
        cards: { type: Array, required: true},
        kompoid: { type: String, required: true }
    },
    data: () => ({
        activeIndex: null,
        items: [],
        layoutKey: 1,
        sortingDisabled: false
    }),
    created() {
        this.items = this.cards
    },
    computed:{
        $_orderingUrl(){ return this.$_data('orderingUrl') },
        $_hasItems(){ return this.items.length > 0 },
        $_orderable(){ return this.component.orderable },
        $_dragHandle(){ return this.component.dragHandle },
        $_sortingAttributes(){
            return Object.assign({
                    disabled: this.sortingDisabled,
                    list: this.items
                }, this.$_dragHandle ? {
                    handle: this.$_dragHandle
                } : {}
            )
        },
        $_sortingEvents(){
            return {
                change: this.change
            }
        }
    },
    methods:{
        $_attributes(item, index) { return this.$_defaultLayoutAttributes(item, index) },
        $_defaultLayoutAttributes(item, index) {
            return {
                key: item.id || index,
                index: parseInt(index),
                active: this.activeIndex == index,
                is: this.$_vueTag(item),
                vkompo: item,
                kompoid: this.kompoid,
                layout: this.component.layout
            }
        },
        activate(index){
            this.activeIndex = (index == this.activeIndex) ? null : index
        },
        change(event){
            if(this.$_orderable){

                const minOrder = _.minBy(this.items, 'data.item_order')
                const newOrder = _.map(this.items, (item, k) => {
                    return {
                        item_id: item.data.item_id,
                        item_order: minOrder.data.item_order + k
                    }
                })

                this.sortingDisabled = true

                this.$_kAxios.$_orderQuery(newOrder).then(r => {
                    this.sortingDisabled = false
                })
            }
        }
    }
}