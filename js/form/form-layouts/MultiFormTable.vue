<template>
    <div v-bind="$_layoutWrapperAttributes" v-show="!$_hidden">
        <vl-form-label :component="component" />
        <div class="vlTableWrapper">
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
        <a href="javascript:void(0)" @click.stop="addRow">
            <i class="icon-plus" /><span v-html="$_data('addLabel')"/>
        </a>
    </div>
</template>

<script>
import Layout from '../mixins/Layout'
import HasName from '../mixins/HasName'
import HasMultiForms from '../mixins/HasMultiForms'
import DoesAxiosRequests from '../mixins/DoesAxiosRequests'

export default {
    mixins: [Layout, HasName, DoesAxiosRequests, HasMultiForms]
}
</script>
