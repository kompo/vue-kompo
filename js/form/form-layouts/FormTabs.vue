<template>
    <div class="vlTabs"
        v-bind="$_layoutWrapperAttributes" 
        v-show="!$_hidden">
        <ul role="tablist" class="vlFlex">
            <li
                v-for="(element, index) in elements"
                :key="index"
                role="presentation"
            >
                <vl-form-tab-label 
                    :activeTab="tabActive(index)"
                    :selectedClass="$_selectedClass"
                    :unselectedClass="$_unselectedClass"
                    :commonClass="$_commonClass"
                    :disabledClass="disabledClass"
                    :vkompo="element"
                    @selectTab="selectTab(index)" />
            </li>
        </ul>
        <div class="vlTabContent">
            <component 
                v-for="(tab,index) in elements" 
                :key="index"
                :activeTab="tabActive(index)"
                v-bind="$_attributes(tab)"/>
        </div>
    </div>
</template>

<script>
import Layout from '../mixins/Layout'
import HasSelectedClass from '../mixins/HasSelectedClass'

export default {
    mixins: [Layout, HasSelectedClass],
    data(){
    	return {
    		activeTab: 0
    	}
    },
    computed: {
        defaultActiveTab(){
            return this.$_config('activeTab')
        },
        disabledClass(){
            return this.$_config('disabledClass')            
        },
    },
    methods:{
        $_validate(errors) {
            Layout.methods.$_validate.call(this, errors)
            this.elements.forEach( (tab, index) => {
	            var errors = []
	            tab.$_getErrors(errors)
	            if(errors.length)
                    this.activeTab = index
            })
        },
        selectTab(index) {
            this.activeTab = index
        },
        tabActive(index) {
            return index == this.activeTab
        },
        tabDisabled(index) {
            return this.elements[index].isDisabled
        },
    },
    created(){
        if(this.defaultActiveTab)
            this.activeTab = this.defaultActiveTab
    },

}
</script>
