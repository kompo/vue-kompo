import Element from '../../element/mixins/Element'
import HashesObjects from '../../element/mixins/HashesObjects'
import DoesAxiosRequests from '../../form/mixins/DoesAxiosRequests'

export default {
    mixins: [ Element, HashesObjects, DoesAxiosRequests ],
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
        
        this.activeIndex = this.component.activeIndex //user can force it

    },
    computed:{
        $_activeClass(){ return this.component.activeClass || 'vlActive' },
        $_hasItems(){ return this.items.length > 0 },
        $_orderable(){ return this.component.orderable },
        $_dragHandle(){ return this.component.dragHandle },
        $_sortingAttributes(){
            return Object.assign({
                    disabled: this.sortingDisabled || !this.$_orderable,
                    list: this.items
                }, this.$_dragHandle ? {
                    handle: this.$_dragHandle
                } : {}
            )
        },
        $_sortingEvents(){
            return {
                change: this.defaultChangeOrder
            }
        }
    },
    methods:{
        $_attributes(item, index) { return this.$_defaultLayoutAttributes(item, index) },
        $_defaultLayoutAttributes(item, index) {
            return {
                //key: this.itemKey(item), //EXPLICITELY set on <component/> cuz Vue emits a warning otherwise...
                index: parseInt(index),
                active: this.activeIndex == index,
                class: this.activeIndex == index ? this.$_activeClass : '',
                is: this.$_vueTag(this.itemRender(item)),
                vkompo: this.itemRender(item),
                kompoid: this.kompoid,
                layout: this.component.layout,
            }
        },
        itemRender(item){ return item.render },
        itemAttributes(item){ return item.attributes },
        defaultKey(item){ return this.itemAttributes(item) ? this.itemAttributes(item).id : null },
        createItemFromRender(render, attr){
            return {
                attributes: attr,
                render: render
            }
        },
        itemKey(item){
            return this.defaultKey(item) || 'vl'+this.hashCode(item) //creating a uniqid from the object
        },
        activate(index, emitPayload){
            this.activeIndex = (index == this.activeIndex) ? null : index
        },
        defaultChangeOrder(){
            this.changeOrder(this.items)
        },
        changeOrder(items){
            if(this.$_orderable){

                const minOrderItem = _.minBy(items, (item) => this.$_config('item_order', this.itemRender(item)) ) || items[0]

                const newOrder = _.map(items, (item, k) => {
                    return {
                        item_id: this.$_config('item_id', this.itemRender(item)),
                        item_order: this.$_config('item_order', this.itemRender(minOrderItem)) + k
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