<template>
    <div v-bind="$_layoutWrapperAttributes" v-show="!$_hidden">
        <vl-form-label :component="component" />
        <draggable 
            v-if="!component.headers"
            v-model="komponents" 
            handle=".js-row-move"
            :style="$_elementStyles">
            <vl-rows
                v-for="(comp,index) in komponents"
                :vkompo="comp"
                :key="index"
                v-bind="$_attributes(comp)" />
        </draggable>
        <div v-else class="vlTableWrapper">
            <table class="w-full table vlTable">
                <vl-table-headers :vkompo="component" :kompoid="$_elKompoId" />
                <tbody>
                    <vl-table-rows
                        v-for="(comp,index) in komponents"
                        :vkompo="comp"
                        :key="comp.key"
                        :kompoid="kompoid" 
                        @deleted="deleteRow(index)" />
                </tbody>
            </table>
        </div>
        <a v-if="!noAdding" 
            href="javascript:void(0)" 
            @click.stop="addRow"
            :class="$_config('addLabelClass')"
            v-html="$_config('addLabel')" />
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
    
}
</script>
