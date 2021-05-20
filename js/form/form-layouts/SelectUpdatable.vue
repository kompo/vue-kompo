<template>
    <div v-bind="$_layoutWrapperAttributes" v-show="!$_hidden">
        
        <component v-bind="$_attributes(komponents[0])" :key="renderKey">
            <template v-slot:after>
                <component
                    class="vlFormComment" 
                    :is="$_vueTag($_config('addLabel'))"
                    :vkompo="$_config('addLabel')"
                    @newitem="loadUpdateForm"
                />
            </template>
        </component>

        <vl-modal :name="'modal'+$_elKompoId">
            <vl-form :vkompo="updateForm" @success="updateOptionsAndValue"/>
        </vl-modal>
    
    </div>
</template>

<script>

import Layout from '../mixins/Layout'
import DoesAxiosRequests from '../mixins/DoesAxiosRequests'

export default {
    mixins: [Layout, DoesAxiosRequests],
    data(){
        return {
            updateForm: false,
            renderKey: 0,
            optionValue: null,
            option: null
        }
    },
    methods: {
        loadUpdateForm(payload){

            this.$_kAxios.$_loadKomposer(payload).then(r => {

                this.updateForm = r.data
                this.$kompo.vlModalShow('modal'+this.$_elKompoId)

            })

        },
        updateOptionsAndValue(r){

            this.option = r.data.option //The user has to set a public option property on the Form
            this.optionValue = Object.keys(this.option)[0]

            this.$_config({
                ajaxPayload: Object.assign({id: this.optionValue}, this.$_config('ajaxPayload')),
            })
                
            var newSelect = this.komponents[0]

            var index = _.findIndex(newSelect.options, {value: this.optionValue});
            newSelect.options.splice(index, 1, {
                value: this.optionValue, 
                label: this.option[this.optionValue] 
            })
            newSelect.value = this.optionValue
            this.komponents.splice(0, 1, newSelect)
            this.renderKey += 1

            this.$_changeAction()

            if(!this.$_config('keepModalOpen'))
                this.$kompo.vlModalClose('modal'+this.$_elKompoId)
        }
    }
}
</script>