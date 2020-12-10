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
                key: this.itemKey(item),
                index: parseInt(index),
                active: this.activeIndex == index,
                is: this.$_vueTag(this.itemRender(item)),
                vkompo: this.itemRender(item),
                kompoid: this.kompoid,
                layout: this.component.layout
            }
        },
        itemRender(item){ return item.render },
        itemAttributes(item){ return item.attributes },
        itemKey(item){ 
            //Attempt to get a unique key for the item 
            //not perfect to review but works 99% of the time 
            //and the user has nothing to do on his side
            
            if(this.itemAttributes(item) && this.itemAttributes(item).id)
                return this.itemAttributes(item).id

            return 'vl'+this.hashCode(JSON.stringify(item).substr(0, 500)) //creating a uniqid from the object
        },
        hashCode(str){
            var hash = 0, i, chr;
            for (i = 0; i < str.length; i++) {
              chr   = str.charCodeAt(i);
              hash  = ((hash << 5) - hash) + chr;
              hash |= 0; // Convert to 32bit integer
            }
            return hash;
        },
        activate(index){
            this.activeIndex = (index == this.activeIndex) ? null : index
        },
        change(event){
            if(this.$_orderable){

                const minOrderItem = _.minBy(this.items, (item) => this.itemRender(item).data.item_order ) || this.items[0]

                const newOrder = _.map(this.items, (item, k) => {
                    return {
                        item_id: this.itemRender(item).data.item_id,
                        item_order: this.itemRender(minOrderItem).data.item_order + k
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