<template>

    <th
        v-bind="$_attributes"
        @click.stop="handleClick"
    >
        <div class="vlThContent">
            <span v-html="thLabel"></span>
            <div v-if="hasFilter" class="vlThFilter" @click.stop>
                <select v-if="hasOptions" v-model="filterValue" @change="onFilterChange"
                        class="vlThFilterSelect">
                    <option value="">--</option>
                    <option v-for="(label, key) in filterOptions" :key="key" :value="key">
                        {{ label }}
                    </option>
                </select>
                <input v-else v-model="filterValue" @input="onFilterInputDebounced"
                       class="vlThFilterInput" :placeholder="'...'" />
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
                this.$_sortsQuery ? 'cursor-pointer' : null
            ]
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
        // Filter computed properties
        hasFilter(){ return !!this.$_config('filterName') },
        filterName(){ return this.$_config('filterName') },
        filterOptions(){ return this.$_config('filterOptions') || {} },
        hasOptions(){ return Object.keys(this.filterOptions).length > 0 },
    },
    methods: {
        handleClick(){
            if(this.$_sortsQuery){
                this.$_clickAction()
            }
        },
    	customBeforeSort(){
    		if(this.initialDirection == 'DESC'){
    			this.sortDirection = this.sortDirection == '' ? 'DESC' :
    				(this.sortDirection == 'DESC'? 'ASC' : '')
	    	}else{
	    		this.sortDirection = this.sortDirection == '' ? 'ASC' :
	    			(this.sortDirection == 'DESC' ? '' : 'DESC')
	    	}
    	},
        // Filter methods
        onFilterChange(){
            this.$kompo.vlBrowseQuery(this.kompoid, 1)
        },
        onFilterInputDebounced(){
            clearTimeout(this.filterDebounce)
            this.filterDebounce = setTimeout(() => {
                this.$kompo.vlBrowseQuery(this.kompoid, 1)
            }, 400)
        },
        $_fillRecursive(jsonFormData){
            if(this.hasFilter && this.filterValue){
                jsonFormData[this.filterName] = this.filterValue
            }
        },
    }
}
</script>
