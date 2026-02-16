<template>

    <th
        v-bind="$_attributes"
        v-click-out="closeDropdown"
    >
        <div class="vlThHeader" @click.stop="toggleDropdown">
            <span v-html="$_label"></span>
            <i v-if="hasSort" :class="iconClass"></i>
            <span v-if="hasInteraction" class="vlThDropdownIcon" :class="{ active: hasActiveFilter }">&#9660;</span>
        </div>

        <div v-if="dropdownOpen" class="vlThDropdown" @click.stop>

            <div v-if="hasSort" class="vlThDropdownSection">
                <div class="vlThSortBtn" :class="{ active: sortingAsc }" @click="applySort('ASC')">
                    <span>&#8593;</span> <span>Sort A&#8594;Z</span>
                </div>
                <div class="vlThSortBtn" :class="{ active: sortingDesc }" @click="applySort('DESC')">
                    <span>&#8595;</span> <span>Sort Z&#8594;A</span>
                </div>
            </div>

            <div v-if="hasSlicer" class="vlThDropdownSection">
                <label class="vlThSlicerSelectAll">
                    <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
                    <span>Select All</span>
                </label>
                <div class="vlThSlicerList">
                    <label v-for="item in slicerItems" :key="item.key">
                        <input type="checkbox" :value="item.key" v-model="slicerSelected" @change="onSlicerChange" />
                        <span>{{ item.label }}</span>
                    </label>
                </div>
            </div>

            <div v-if="hasFilter" class="vlThDropdownSection">
                <input
                    class="vlThFilterInput"
                    v-model="filterValue"
                    @input="onFilterInput"
                    placeholder="Filter..."
                />
            </div>

        </div>
    </th>

</template>

<script>
import Trigger from '../../form/mixins/Trigger'

export default {
    mixins: [Trigger],
    data(){
    	return {
    		sortColumn: '',
    		sortDirection: '',
    		initialDirection: '',
            dropdownOpen: false,
            slicerSelected: [],
            filterValue: '',
            filterDebounce: null,
    	}
    },
    created(){
    	if(this.$_sortsQuery){
	    	var sortSpecs = this.$_sortsQuery.split(':')
	    	this.sortColumn = sortSpecs[0]
	    	this.initialDirection = sortSpecs.length == 2 ? sortSpecs[1] : ''
	    }
    },
    computed: {
        $_customClassArray() { 
            return [
                //this.$_sortsQuery ? 'cursor-pointer' : null
                this.hasInteraction ? 'vlThInteractive' : null
            ] 
        },
        hasSort(){ return !!this.$_sortsQuery },
        hasSlicer(){ return !!this.$_config('slicerName') },
        hasFilter(){ return !!this.$_config('filterName') },
        hasInteraction(){ return this.hasSort || this.hasSlicer || this.hasFilter },
        hasActiveFilter(){
            return (this.hasSort && this.sortDirection) ||
                   (this.hasSlicer && this.slicerSelected.length > 0 && this.slicerSelected.length < this.slicerItems.length) ||
                   (this.hasFilter && this.filterValue)
        },
        activeSort(){
        	return this.$_sortsQuery && this.$_state('activeSort')
        },
        sortingDesc(){ return this.activeSort && this.sortDirection == 'DESC' },
        sortingAsc(){ return this.activeSort && this.sortDirection == 'ASC' },
        thLabel(){
            return this.$_label + '<i class="' + this.iconClass + '"></i>'
        },
        iconClass(){
        	return this.sortingDesc ? 'icon-down' : (this.sortingAsc ? 'icon-up' : '')
        },
        $_sortValue(){
        	return this.sortDirection ? (this.sortColumn+':'+this.sortDirection) : ''
        },
        slicerOptions(){ return this.$_config('slicerOptions') || {} },
        hasSlicerOptions(){ return Object.keys(this.slicerOptions).length > 0 },
        slicerItems(){
            if(this.hasSlicerOptions){
                return Object.keys(this.slicerOptions).map(k => ({ key: k, label: this.slicerOptions[k] }))
            }
            return this.extractColumnValues().map(v => ({ key: v, label: v }))
        },
        allSelected(){
            return this.slicerItems.length > 0 && this.slicerSelected.length == this.slicerItems.length
        },
    },
    methods: {
    	customBeforeSort(){
            
    	},
        /*
        customBeforeSort(){
            // Sort direction is already set by applySort
        },*/
        toggleDropdown(){
            if(!this.hasInteraction) return
            this.dropdownOpen = !this.dropdownOpen
        },
        closeDropdown(){
            this.dropdownOpen = false
        },
        applySort(direction){
            if(this.sortDirection == direction){
                this.sortDirection = ''
            }else{
                this.sortDirection = direction
            }
            this.$_clickAction()
        },
        $_resetSortValue(){
            this.sortDirection = ''
        },
        onSlicerChange(){
            this.$kompo.vlBrowseQuery(this.kompoid, 1)
        },
        toggleSelectAll(){
            if(this.allSelected){
                this.slicerSelected = []
            }else{
                this.slicerSelected = this.slicerItems.map(i => i.key)
            }
            this.onSlicerChange()
        },
        onFilterInput(){
            clearTimeout(this.filterDebounce)
            this.filterDebounce = setTimeout(() => {
                this.$kompo.vlBrowseQuery(this.kompoid, 1)
            }, 400)
        },
        extractColumnValues(){
            if(!this.$el) return []
            var table = this.$el.closest('table')
            if(!table) return []
            var thIndex = Array.from(this.$el.parentNode.children).indexOf(this.$el)
            var cells = table.querySelectorAll('tbody tr td:nth-child(' + (thIndex + 1) + ')')
            var values = new Set()
            cells.forEach(function(td){
                var text = td.textContent.trim()
                if(text) values.add(text)
            })
            return Array.from(values).sort()
        },
        $_fillRecursive(jsonFormData){
            if(this.hasSlicer && this.slicerSelected.length > 0 && !this.allSelected){
                jsonFormData[this.$_config('slicerName')] = this.slicerSelected
            }
            if(this.hasFilter && this.filterValue){
                jsonFormData[this.$_config('filterName')] = this.filterValue
            }
        },
    }
}
</script>
