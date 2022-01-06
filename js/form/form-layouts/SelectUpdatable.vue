<template>
    <div v-bind="$_layoutWrapperAttributes" v-show="!$_hidden">
        
        <component v-bind="$_attributes(elements[0])" :key="renderKey">
            <template v-slot:after>
                <component
                    v-if="!$_readOnly"
                    class="vlFormComment" 
                    :is="$_vueTag($_config('addLabel'))"
                    :vkompo="$_config('addLabel')"
                    @newitem="loadUpdateForm"
                />
            </template>
        </component>
    
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
    computed: {
        $_readOnly(){ return this.$_config('readOnly') },
    },
    methods: {
        loadUpdateForm(payload){

            this.$_kAxios.$_loadKomponent(payload).then(r => {

                this.$kompo.vlFillModal(r, this.$_elKompoId, {
                    updateSelectOption: true,
                    closeAfterSubmit: !this.$_config('keepOpen'),
                })

            })

        },
        updateOptionsAndValue(r){

            this.option = r.data.option //The user has to set a public option property on the Form
            this.optionValue = Object.keys(this.option)[0]

            /*this.$_config({
                ajaxPayload: Object.assign({id: this.optionValue}, this.$_config('ajaxPayload')),
            })*/
                
            let newSelect = this.elements[0]

            let index = _.findIndex(newSelect.options, {value: this.optionValue})
            let formattedOption = {
                value: this.optionValue, 
                label: this.option[this.optionValue] 
            }
            newSelect.options.splice(index, 1, formattedOption)
            newSelect.$_handleAddedOption(formattedOption)
            return

            //TO delete if no issues detected...
            //newSelect.value = this.optionValue //To review - setting select value...
            this.elements.splice(0, 1, newSelect)
            this.renderKey += 1
            
            newSelect.$_addOptionToValue(formattedOption) //... is very different from using it in requests.
        },

        $_attachCustomEvents(){
            this.$_vlOn('vlUpdateSelectOption'+this.$_elKompoId, (response) => {

                this.updateOptionsAndValue(response)

            })
        },
        $_destroyCustomEvents(){
            this.$_vlOff([
                'vlUpdateSelectOption'+this.$_elKompoId,
            ])
        },
    }
}
</script>