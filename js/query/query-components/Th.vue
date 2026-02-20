<template>

    <th
        v-bind="$_attributes"
        v-click-out="closeDropdown"
    >
        <div class="vlThHeader" @click.stop="toggleDropdown">
            <span v-html="$_label"></span>
            <svg v-if="hasInteraction" class="vlThDropdownIcon" :class="{ '!text-sortcolor text-level3 opacity-100': hasActiveFilter || dropdownOpen, open: dropdownOpen }" viewBox="0 0 16 16" fill="currentColor"><path d="M3.2 5.7a.7.7 0 011-.05L8 9.2l3.8-3.55a.7.7 0 01.95 1.03l-4.25 4a.7.7 0 01-.96 0l-4.25-4a.7.7 0 01-.05-1z"/></svg>
        </div>

        <div v-if="dropdownOpen" class="vlThDropdown" @click.stop>

            <div v-if="hasSort" class="vlThDropdownSection">
                <div class="vlThSortBtn" :class="{ active: sortingAsc, '!bg-sortcolor/10 bg-level3/10 !text-sortcolor text-level3 font-medium': sortingAsc }" @click="applySort('ASC')">
                    <span class="vlThSortIcon"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 3.5a.7.7 0 01.5.2l4 4.3a.7.7 0 01-1 1L8 5.3 4.5 9a.7.7 0 01-1-1l4-4.3a.7.7 0 01.5-.2z"/></svg></span>
                    <span>Sort A &rarr; Z</span>
                </div>
                <div class="vlThSortBtn" :class="{ active: sortingDesc, '!bg-sortcolor/10 bg-level3/10 !text-sortcolor text-level3 font-medium': sortingDesc }" @click="applySort('DESC')">
                    <span class="vlThSortIcon"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M3.2 5.7a.7.7 0 011-.05L8 9.2l3.8-3.55a.7.7 0 01.95 1.03l-4.25 4a.7.7 0 01-.96 0l-4.25-4a.7.7 0 01-.05-1z"/></svg></span>
                    <span>Sort Z &rarr; A</span>
                </div>
            </div>

            <div v-if="hasSlicer" class="vlThDropdownSection">
                <input v-if="slicerItems.length > 6"
                    class="vlThSlicerSearch"
                    v-model="slicerSearch"
                    placeholder="Search..."
                />
                <label class="vlThSlicerSelectAll">
                    <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
                    <span>Select All</span>
                    <span class="vlThSlicerCount">{{ slicerSelected.length }}/{{ slicerItems.length }}</span>
                </label>
                <div class="vlThSlicerList">
                    <label v-for="item in filteredSlicerItems" :key="item.key">
                        <input type="checkbox" :value="item.key" v-model="slicerSelected" @change="onSlicerChange" />
                        <span>{{ item.label }}</span>
                    </label>
                </div>
            </div>

            <div v-if="hasFilter" class="vlThDropdownSection">
                <select v-if="hasFilterOptions"
                    class="vlThFilterSelect"
                    v-model="filterValue"
                    @change="onFilterSelect">
                    <option value="">--</option>
                    <option v-for="(label, key) in filterOptions" :key="key" :value="key">{{ label }}</option>
                </select>
                <input v-else
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
            slicerSearch: '',
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
        $_sortValue(){
            return this.sortDirection ? (this.sortColumn+':'+this.sortDirection) : ''
        },
        filterOptions(){ return this.$_config('filterOptions') || null },
        hasFilterOptions(){ return this.filterOptions && Object.keys(this.filterOptions).length > 0 },
        slicerOptions(){ return this.$_config('slicerOptions') || {} },
        hasSlicerOptions(){ return Object.keys(this.slicerOptions).length > 0 },
        slicerItems(){
            if(this.hasSlicerOptions){
                return Object.keys(this.slicerOptions).map(k => ({ key: k, label: this.slicerOptions[k] }))
            }
            return this.extractColumnValues().map(v => ({ key: v, label: v }))
        },
        filteredSlicerItems(){
            if(!this.slicerSearch) return this.slicerItems
            var search = this.slicerSearch.toLowerCase()
            return this.slicerItems.filter(item => item.label.toString().toLowerCase().indexOf(search) > -1)
        },
        allSelected(){
            return this.slicerItems.length > 0 && this.slicerSelected.length == this.slicerItems.length
        },
    },
    methods: {
        toggleDropdown(){
            if(!this.hasInteraction) return
            this.dropdownOpen = !this.dropdownOpen
        },
        closeDropdown(){
            this.dropdownOpen = false
            this.slicerSearch = ''
        },
        applySort(direction){
            if(this.sortDirection == direction){
                this.sortDirection = ''
            }else{
                this.sortDirection = direction
            }
            this.$_clickAction()
        },
        customBeforeSort(){
            // Sort direction is already set by applySort
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
        onFilterSelect(){
            this.$kompo.vlBrowseQuery(this.kompoid, 1)
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
