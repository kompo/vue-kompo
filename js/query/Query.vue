<template>
    <div v-bind="queryAttributes" :class="[queryClass, $_filterLoadingClass]">

        <component v-bind="filtersAttributes('Left')" />

        <component v-bind="filtersAttributes('Top')" />

        <component v-if="showTopPagination" @browse="browseQueryFromPagination" v-bind="paginationAttributes(paginationClassT)" />

        <!-- Filter Loading Bar (always visible when filtering) -->
        <transition name="fade">
            <div v-if="filterIsLoading" class="vlQuery__loading-bar">
                <div class="vlQuery__loading-bar-progress"></div>
            </div>
        </transition>

        <div class="vlQueryWrapper"
            :class="[itemsWrapperClass, { 'vlQueryWrapper--loading': filterIsLoading && filterMode === 'server' }]"
            :style="itemsWrapperStyle"
            ref="vlQueryWrapper"
            @scroll="onScroll">

            <!-- Items (in server mode, cards are cleared while loading but structure remains) -->
            <table v-if="isTableLayout" class="w-full table vlTable" :class="tableClass">
                <vl-table-headers :vkompo="component" :kompoid="$_elKompoId" :key="headersKey" />
                <component v-bind="layoutAttributes" />
                <vl-table-footers :vkompo="component" :kompoid="$_elKompoId" />
            </table>

            <component v-else
                v-bind="layoutAttributes"
                @browse="browseQuery"
            />
        </div>

        <component v-if="showBottomPagination" @browse="browseQueryFromPagination" v-bind="paginationAttributes(paginationClassB)" />

        <component v-bind="filtersAttributes('Bottom')" />

        <component v-bind="filtersAttributes('Right')" />

    </div>
</template>

<script>
import BaseElement from '../element/mixins/BaseElement'
import DoesAxiosRequests from '../form/mixins/DoesAxiosRequests'
import IsKomponent from '../mixins/IsKomponent'
import HybridFilter from './mixins/HybridFilter'

export default {
    mixins: [BaseElement, IsKomponent, DoesAxiosRequests, HybridFilter],
    props: {
        kompoid: { type: String, required: false }
    },
    data: () => ({
        currentPage: 1,
        currentSort: '',
        initialFilters: {},
        filters: [],
        cards: [],
        pagination: null,
        headers: [],
        headersKey: '',
        cardsKey: '',
        filtersKey: 1,
        checkedItemIds: [],
        isBrowsing: false,
    }),
    created() {
        this.cardsKey = 'cards' + this.component.id
        this.headersKey = 'headers' + this.component.id
        this.filters = this.component.filters
        this.cards = this.getCards(this.component)
        this.pagination = this.getPagination(this.component)
        this.headers = this.component.headers

        this.checkedItemIds = this.component.checkedItemIds || []

        this.$_configureEcho()
        this.$_saveLiveKomponent()
    },
    mounted() {

        if (this.isScrollPagination && this.topPagination) {
            this.$refs.vlQueryWrapper.scrollTop = this.$refs.vlQueryWrapper.scrollHeight
        }

        this.$_runOwnInteractions('load')
        this.$_filterOutInteractions('load')
    },
    computed: {

        filtersPlacement(){ return [ 'top', 'left', 'bottom', 'right' ] },
        hasSideFilters(){
            return this.filters['left'].length || this.filters['right'].length
        },
        queryClass(){
            return this.$_classString([
                'vlQuery',

                this.$_phpClasses
            ])
        },
        queryAttributes(){
            return {
                ...this.$_defaultElementAttributes,
                class: this.queryClass,
                style: this.$_elementStyles
            }
        },
        itemsWrapperClass(){
            return this.$_classString([
                this.isTableLayout ? 'vlTableWrapper' : '',
                this.component.itemsWrapperClass,
                this.isScrollPagination ? 'overflow-y-auto' : '',
            ])
        },
        itemsWrapperStyle(){
            return this.component.itemsWrapperStyle
        },
        layoutAttributes(){
            return {
                is: this.layoutComponent,
                vkompo: this.component,
                kompoid: this.$_elKompoId,
                cards: this.cards,
                key: this.cardsKey,
                initial: this.initialFilters,
                class: (this.isScrollPagination && this.topPagination && this.component.layout == 'Horizontal') ? 
                            'flex flex-col-reverse' : ''
            }
        },
        isScrollPagination() { return this.component.paginationType == 'Scroll' },
        tableClass() { return this.component.tableClass },
        hasPagination() { return this.component.hasPagination && !this.isScrollPagination },
        topPagination(){ return this.component.topPagination },
        bottomPagination(){ return this.component.bottomPagination },
        showTopPagination(){ return this.hasPagination && this.topPagination },
        showBottomPagination(){ return this.hasPagination && this.bottomPagination },
        leftPagination(){ return this.hasPagination && this.component.leftPagination },
        paginationType() { return 'VlPagination' + this.component.paginationType },
        paginationClassB(){ return this.showBottomPagination ? 'vlPaginationB' : ''},
        paginationClassT(){ return this.showTopPagination ? 'vlPaginationT' : ''},
        layoutComponent(){ 
            if(this.component.layout == 'CalendarMonth')
                return 'VlCalendarMonth'

            return this.hasItems ? 'vl-' + this.component.layout : this.noItemsComponent 
        },
        isTableLayout(){ return this.component.layout.indexOf('Table') > -1 },
        hasItems(){ return this.cards.length > 0 || this.filterIsLoading },
        noItemsComponent(){ return this.isTableLayout ? 'vl-table-no-items' : 'vl-no-items' },
    },
    methods: {
        getCards(query){ return this.getPagination(query).data },
        getPagination(query){ return query.query },
        getPaginationClass(secondClass){
            return this.$_classString([
                this.leftPagination ? '' : 'justify-end',
                this.component.paginationClass,
                secondClass,
            ])
        },
        paginationAttributes(positionClass){
            return {
                is: this.paginationType,
                pagination: this.pagination,
                class: this.getPaginationClass(positionClass)
            }
        },
        filtersAttributes(placement){
            return {
                is: this.filters[placement.toLowerCase()].length > 1 ? 'VlFilters' : 'VlFiltersSingle',
                filters: this.filters[placement.toLowerCase()],
                placement: placement,
                kompoid: this.$_elKompoId,
                key: placement+this.filtersKey
            }
        },
        getJsonFormData(jsonFormData){
            this.$_fillRecursive(jsonFormData)
            return jsonFormData
        },
        getJsonFormDataWithFilters(resetFilters){
            if (resetFilters) {
                return this.initialFilters
            }

            return this.getJsonFormData(
                Object.assign(
                    {}, 
                    this.initialFilters, 
                    this.checkedItemIds.length ? {itemIds: this.checkedItemIds } : {}
                )
            )
        },
        preparedFormData(){
            var formData = new FormData(), 
                jsonFormData = this.getJsonFormDataWithFilters()
                
            for ( var key in jsonFormData ) {
                formData.append(key, jsonFormData[key])
            }
            return formData
        },
        $_echoTrigger(){

            if(this.currentPage != 1) //a current limitation.. TODO: handle when on other pages
                return

            this.browseQuery()
        },
        fixTopPaginationScroll(scrollHeightBefore){
            if(this.isScrollPagination && this.topPagination){
                scrollHeightBefore = scrollHeightBefore || 0
                this.$nextTick( () => {
                    this.$refs.vlQueryWrapper.scrollTop = this.$refs.vlQueryWrapper.scrollHeight - scrollHeightBefore
                })
            }
        },
        onScroll({ target: { scrollTop, clientHeight, scrollHeight }}){
            if(!this.isScrollPagination)
                return

            if(this.isBrowsing)
                return

            if(this.pagination.current_page >= this.pagination.last_page) //>= was necessary because when we delete, the height is smaller and below gets triggered
                return

            if(this.bottomPagination)
                if (scrollTop + clientHeight >= scrollHeight - 5)
                    this.browseQuery(this.currentPage + 1, true)

            if(this.topPagination)
                if (scrollTop == 0)
                    this.browseQuery(this.currentPage + 1, true)
        },
        browseQueryFromPagination(page) {
            this.browseQuery(page)
            this.headersKey += 1
        },
        browseQuery(page, additive) {
            
            this.isBrowsing = true

            this.currentPage = page || this.currentPage
            this.$_kAxios.$_browseQuery(this.currentPage, this.currentSort).then(r => {
                
                this.loadItems(r.data, additive)


                this.isBrowsing = false

                this.checkedItemIds = []

            })
            .catch(e => {
                this.isBrowsing = false
                console.log('Error in Query.vue', e)
                if (e.response.status == 422){
                    this.$_validate(e.response.data.errors)
                }else{
                    this.$_kAxios.$_handleAjaxError(e) 
                }

                this.$_state({ loading: false })
            })
        },
        loadItems(responseData, additive){
            this.$_state({ loading: false })

            this.pagination = responseData
            Vue.set(this, 'cards', 
                additive ? 
                    this.cards.concat(responseData.data) : 
                    responseData.data
            )
            this.cardsKey += 1 //to re-render cards

            this.fixTopPaginationScroll(
                additive ? this.$refs.vlQueryWrapper.scrollHeight : 0
            )

            this.$_runOwnInteractions('load')
        },
        $_attachEvents(){
            this.$_vlOn('vlEmit'+this.$_elKompoId, (eventName, eventPayload) => {

                if (eventName == 'checkItemId') {
                    let itemId = eventPayload.id
                    this.checkedItemIds.includes(itemId) ? 
                        this.checkedItemIds.splice(this.checkedItemIds.indexOf(itemId), 1) : 
                        this.checkedItemIds.push(itemId)
                }

                if (eventName == 'checkAllItems') {
                    this.checkedItemIds = (this.checkedItemIds.length == this.cards.length) ? [] :
                        this.cards.map((item) => item.attributes.id)
                }

                this.$emit(eventName, eventPayload)

                this.$_runOwnInteractions('emit', {
                    payload: eventPayload
                })
            })
            this.$_vlOn('vlReloadAfterChildAction'+this.$_elKompoId, (response) => {
                this.browseQuery()
            })
            this.$_vlOn('vlBrowseQuery'+this.$_elKompoId, (page, initialFilters) => {
                this.currentPage = page ? page : this.currentPage
                this.initialFilters = initialFilters ? initialFilters : this.initialFilters //first introduced to get month, year from CalendarMonth

                this.browseQuery()
            })
            this.$_vlOn('vlRequestKomponentInfo'+this.$_elKompoId, (askerId, options) => {

                if(!this.$_isLive)
                    return

                this.$kompo.vlDeliverKomponentInfo(askerId, this.$_elKompoId, {
                    kompoinfo: this.$_kompoInfo,
                    data: this.getJsonFormDataWithFilters(options.resetFilters),
                    page: options.page || this.currentPage,
                    sort: this.currentSort,
                })
            })
            this.$_vlOn('vlLoadItems'+this.$_elKompoId, (responseData) => {
                this.loadItems(responseData)
            })
            this.$_vlOn('vlRefreshKomponent'+this.$_elKompoId, (responseData) => {
                
                this.$_removeLiveKomponent() //because this.$_elKompoId changed
                this.$_destroyEvents()
                this.component = responseData
                this.$_saveLiveKomponent()
                this.$_attachEvents()

                Vue.set(this, 'filters', this.component.filters)
                Vue.set(this, 'pagination', this.getPagination(this.component))
                Vue.set(this, 'cards', this.getCards(this.component))
                Vue.set(this, 'headers', this.component.headers)

                this.cardsKey += 1
                this.filtersKey += 1

                this.checkedItemIds = []

                this.fixTopPaginationScroll()
            })

            this.$_vlOn('vlRemoveItem'+this.$_elKompoId, (index) => {
                this.cards.splice(index, 1)
            })

            this.$_vlOn('vlHybridFilter'+this.$_elKompoId, (value, debounce, attribute, mode) => {
                if (attribute) {
                    this.hybridFilterAttribute = attribute
                }
                if (!this.hybridOriginalCards) {
                    this.hybridOriginalCards = [...this.cards]
                }
                this.$_hybridFilter(value, debounce, mode)
            })

            this.$_vlOn('vlJsInstantFilter'+this.$_elKompoId, (value, attribute) => {
                if (attribute) {
                    this.hybridFilterAttribute = attribute
                }
                if (!this.hybridOriginalCards) {
                    this.hybridOriginalCards = [...this.cards]
                }
                this.$_instantFilter(value)
            })

            this.$_vlOn('vlAddItem'+this.$_elKompoId, (item, position, itemId) => {
                const card = this.$_wrapAsCard(item, itemId)

                if (position === 'prepend' || position === 0) {
                    this.cards.unshift(card)
                } else if (typeof position === 'number') {
                    this.cards.splice(position, 0, card)
                } else {
                    this.cards.push(card)
                }
                this.cardsKey += 1
            })

            this.$_vlOn('vlPrependItem'+this.$_elKompoId, (item, itemId) => {
                const card = this.$_wrapAsCard(item, itemId)
                this.cards.unshift(card)
                this.cardsKey += 1
            })

            this.$_vlOn('vlUpdateItem'+this.$_elKompoId, (itemId, item) => {
                const index = this.cards.findIndex(c =>
                    (c.attributes?.id === itemId) || (c.id === itemId) || (c.config?.id === itemId)
                )
                if (index !== -1) {
                    const card = this.$_wrapAsCard(item, itemId)
                    Vue.set(this.cards, index, card)
                    this.cardsKey += 1
                }
            })

            this.$_vlOn('vlRemoveItemById'+this.$_elKompoId, (itemId) => {
                const index = this.cards.findIndex(c =>
                    (c.attributes?.id === itemId) || (c.id === itemId) || (c.config?.id === itemId)
                )
                if (index !== -1) {
                    this.cards.splice(index, 1)
                    this.cardsKey += 1
                }
            })

            this.$_vlOn('vlSort'+this.$_elKompoId, (sortValue, emitterId) => {
                this.currentSort = sortValue == this.currentSort ? '' : sortValue
                this.currentPage = 1
                this.$_resetSort(emitterId)
                this.browseQuery()
            })
            this.$_vlOn('vlToggle'+this.$_elKompoId, (toggleId) => {
                this.$_toggle(toggleId)
            })
            this.$_deliverKompoInfoOn()
        },
        $_destroyEvents(){
            this.$_vlOff([
                'vlEmit'+this.$_elKompoId,
                'vlReloadAfterChildAction'+this.$_elKompoId,
                'vlBrowseQuery'+this.$_elKompoId,
                'vlRequestKomponentInfo'+this.$_elKompoId,
                'vlRefreshKomponent'+this.$_elKompoId,
                'vlLoadItems'+this.$_elKompoId,
                'vlRemoveItem'+this.$_elKompoId,
                'vlHybridFilter'+this.$_elKompoId,
                'vlJsInstantFilter'+this.$_elKompoId,
                'vlAddItem'+this.$_elKompoId,
                'vlPrependItem'+this.$_elKompoId,
                'vlUpdateItem'+this.$_elKompoId,
                'vlRemoveItemById'+this.$_elKompoId,
                'vlSort'+this.$_elKompoId,
                'vlToggle'+this.$_elKompoId,
                this.$_deliverKompoInfoOff
            ])
        },
        $_wrapAsCard(item, itemId = null) {
            // Already a card structure?
            if (item && item.attributes !== undefined && item.render !== undefined) {
                return item
            }

            // Try to get ID from item if not provided
            const id = itemId || item?.id || item?.config?.id || item?.attributes?.id || null

            return {
                attributes: { id: id },
                render: item,
            }
        },
        $_fillRecursive(jsonFormData){
            this.filtersPlacement.forEach(placement => {
                this.filters[placement].forEach( item => item.$_fillRecursive(jsonFormData) )
            }
            )
        },
        $_resetSort(emitterId){
            this.filtersPlacement.forEach(placement => 
                this.filters[placement].forEach( item => item.$_resetSort(emitterId) )
            )
            this.headers.forEach( item => item.$_resetSort(emitterId) )
        },
        $_state(state){
            this.filtersPlacement.forEach(placement => 
                this.filters[placement].forEach( item => item.$_state(state) )
            )
        },
        $_toggle(toggleId){
            //To review... Toggling shouldn't be recursive, it should be a direct emit event action
            this.filtersPlacement.forEach(placement => 
                this.filters[placement].forEach( item => {
                    //because cards can trigger toggle before filters are created
                    if(item && item.$_toggle) 
                        item.$_toggle(toggleId)
                })
            )
            this.cards.forEach( item => {
                //because filters can trigger toggle before cards are created
                if(item.render && item.render.$_toggle) 
                    item.render.$_toggle(toggleId) 
            })
        },
        $_validate(errors) {
            this.filtersPlacement.forEach(placement => 
                this.filters[placement].forEach( item => item.$_validate(errors) )
            )
        },

    }
}

</script>
