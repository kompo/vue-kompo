<template>
    <div v-bind="$_layoutWrapperAttributes" v-show="!$_hidden">
        <vl-form-label :component="component" />
        <component
            v-if="!noAdding && topAdding"
            :is="$_vueTag($_config('addLabel'))"
            :vkompo="$_config('addLabel')"
            :kompoid="kompoid" 
            @newitem="addRow"
        />
        <draggable 
            v-if="!component.headers"
            v-model="elements" 
            handle=".js-row-move">
            <vl-rows
                v-for="(comp,index) in elements"
                :vkompo="comp"
                :key="comp.key"
                v-bind="$_attributes(comp)" 
                @touchedForm="touchedForm"
                @deleted="deleteRow(index)"
            />
        </draggable>
        <div v-else class="vlTableWrapper">
            <table class="w-full table vlTable">
                <vl-table-headers 
                    v-if="elements.length"
                    :vkompo="component" 
                    :kompoid="$_elKompoId" />
                <tbody>
                    <vl-table-rows
                        v-for="(comp,index) in elements"
                        :vkompo="comp"
                        :key="comp.key"
                        :kompoid="kompoid" 
                        @deleted="deleteRow(index)" 
                    />
                </tbody>
            </table>
        </div>
        <component
            v-if="!noAdding && !topAdding"
            :is="$_vueTag($_config('addLabel'))"
            :vkompo="$_config('addLabel')"
            :kompoid="kompoid" 
            @newitem="addRow"
        />
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import Layout from '../mixins/Layout'
import HasName from '../mixins/HasName'
import HasMultiForms from '../mixins/HasMultiForms'
import DoesAxiosRequests from '../mixins/DoesAxiosRequests'

export default {
    mixins: [Layout, HasName, DoesAxiosRequests, HasMultiForms],
    components: { draggable },
    methods: {
        touchedForm(){
            this.$kompo.vlUpdateErrorState(this.kompoid)
        },
    }
    
}
</script>
