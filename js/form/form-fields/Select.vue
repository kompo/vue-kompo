<template>
    <vl-form-field v-bind="$_wrapperAttributes">
        <vlTaggableInput 
            v-click-out="blur"
            v-bind="$_taggableInputAttributes" 
            v-on="$_taggableInputEvents">
            <template v-slot:prepend v-if="$_icon">
                <div v-bind="prependIcon" />
            </template>
            <input
                class="vlFormControl"
                v-bind="$_attributes"
                v-on="$_events"
                v-model="inputValue"
                @keydown.enter.prevent="() => {}"
                ref="input"
                type="search" 
                autocomplete="off"
            />
            <template v-slot:append v-if="appendIcon && !$_readOnly">
                <div v-html="appendIcon"/>
            </template>
        </vlTaggableInput>
        <div class="vlOptions" :key="optionsKey" ref="selectOptions">
            <template v-if="filteredOptions.length">
                <div v-for="(option,key) in filteredOptions" :key="option.value" :ref="key"
                    class="vlOption"
                    :class="{
                        'vlSelected' : isSelected(option),
                        'vlHoveredOption' : key == hoveredOption
                    }"
                    @click.stop="select(option)"
                    @mouseover="setHoveredOption(key)">
                    <vlCustomLabel :vkompo="option.label" :kompoid="kompoid" />
                </div>
            </template>
            <template v-else>
                <div class="vlOption" v-html="optionsMessage" />
            </template>
        </div>

        <template v-slot:after>
            <slot name="after"/>
        </template>

    </vl-form-field>
</template>

<script>
import FieldSelect from '../mixins/FieldSelect'
import HasTaggableInput from '../mixins/HasTaggableInput'
import DoesAxiosRequests from '../mixins/DoesAxiosRequests'
import LabelSearcher from '../../core/LabelSearcher'

export default {
    mixins: [FieldSelect, HasTaggableInput, DoesAxiosRequests],
    data(){
        return {
            optionsMessage: '',
            filteredOptions: [],
            hoveredOption: 0,
            updateForm: false,
            optionsKey: 0
        }
    },
    mounted(){
        this.filteredOptions = this.options
        this.optionsMessage = this.ajaxOptions ? this.enterMoreCharacters : this.noOptionsFound
        
        if(this.focusOnLoad)
            this.focus()
    },
    created() {
        this.vkompo.$_handleAddedOption = this.$_handleAddedOption
    },
    computed: {
        $_events() {
            return {
                ...this.$_defaultFieldEvents,
                blur: () => {}, //do nothing
                change: () => {}, //do nothing
                click: this.loadOptions,
                keydown: this.keyDown,
            }
        },
        prependIcon(){ 
            return {
                is: {template: this.$_icon}
            }
        },
        appendIcon(){ return this.$_config('searchInput') ? null :
            (this.$_state('focusedField') ? this.$_config('iconUp') : this.$_config('iconDown')) },
        noOptionsFound(){ return this.$_config('noOptionsFound')},
        enterMoreCharacters(){ return this.$_config('enterMoreCharacters')},
        ajaxOptions(){ return this.$_config('ajaxOptions') },
        ajaxMinSearchLength(){ return this.$_config('ajaxMinSearchLength') },
        ajaxOptionsFromField(){ return this.$_config('ajaxOptionsFromField') },
        debouncedAjaxFunction(){ return _.debounce(this.loadOptionsByAjax, 300)},
        focusOnLoad(){ return this.$_config('focusOnLoad') },
    },
    methods: {
        keyDown(key){
            if(key.code == 'Tab')
                this.$_blurAction()
        },
        $_keyUp(key){
            if(key.code == 'ArrowUp'){
                this.prevOption()
            }else if(key.code == 'ArrowDown'){
                this.nextOption()
            }else if(key.code === 'Enter'){
                this.selectHoveredOption()
            }else if(key.code == 'Escape'){
                this.forceBlur()
            }else{
                this.loadOptions()
            }
        },
        loadOptions(){
            if(this.$_readOnly)
                return

            if(this.ajaxOptions){
                if(this.ajaxOptionsFromField){
                    this.inputValue ? this.filterOptions() : this.debouncedAjaxFunction()
                }else{
                    this.debouncedAjaxFunction()
                }
            }else{
                this.filterOptions()
            }
        },
        $_fill(jsonFormData){
            if(this.$_multiple){
                !this.$_value.length ? 
                    jsonFormData[this.$_name] = [] :
                    this.$_value.forEach((option, k) => {
                        jsonFormData[this.$_name+'['+k+']'] = option.value
                    })
            }else{
                jsonFormData[this.$_name] = this.$_value.length ? this.$_value[0].value : ''
            }
        },
        focus(){
            this.$refs.input.focus()
        },
        blur(){
            this.$_state('focusedField') && this.forceBlur()
        },
        forceBlur(){
            this.reset()
            this.$refs.input.blur()
            this.$_blurAction()            
        },
        select(option){
            if(option.label && _.isObject(option.label) && option.label.$_config('disabled'))
                return

            if (this.isSelected(option)) {
                //this.$_remove(this.indexOf(option)) //disabled remove on click => better UX
            } else {
                this.$_addOptionToValue(option)
            }

            this.reset()
            this.$_blurAction()
        },
        filterOptions(){
            this.filteredOptions = (new LabelSearcher()).filterOptions(this.options, this.inputValue)
        },
        $_addOptionToValue(option){
            if(this.$_multiple){
                this.component.value.push(option)
            }else{
                this.component.value = [option]
            }
            this.$_changeAction()
        },
        $_handleAddedOption(option){
            this.$_addOptionToValue(option)
            this.$_blurAction()
        },
        $_remove(index) {
            if(this.$_readOnly)
                return
            
            this.component.value.splice( index, 1)
            this.forceBlur()
            this.$_changeAction()
        },
        indexOf(option){
            return _.findIndex(this.component.value, {value: option.value})
        },
        isSelected(option){
            return this.indexOf(option) !== -1
        },
        reset(){
            this.$_emptyInput()
            if(this.ajaxOptions){
                this.component.options = []
                this.filteredOptions = []
            }
            this.hoveredOption = 0
        },
        prevOption(){
            this.hoveredOption = this.hoveredOption == 0 ? this.filteredOptions.length - 1 : this.hoveredOption - 1

            this.correctScrollToHovered('previous');
        },
        nextOption(){
            this.hoveredOption = this.hoveredOption == this.filteredOptions.length - 1 ? 0 : this.hoveredOption + 1

            this.correctScrollToHovered('next');
        },
        correctScrollToHovered(nextOrPrev = 'next') {
            const hoveredEl = this.$refs[this.hoveredOption][0]
            const optionsContainerEl = this.$refs.selectOptions;

            if(nextOrPrev == 'next' && this.hoveredOption == 0) {
                this.scrollToHoveredPrevious(hoveredEl, optionsContainerEl, true);
                return;
            }

            if (nextOrPrev == 'previous' && this.hoveredOption == this.filteredOptions.length - 1) {
                this.correctScrollToHoveredNext(hoveredEl, optionsContainerEl, true);
                return;
            }

            nextOrPrev == 'next' ? this.correctScrollToHoveredNext(hoveredEl, optionsContainerEl)
                    : this.scrollToHoveredPrevious(hoveredEl, optionsContainerEl);
        },
        correctScrollToHoveredNext(hoveredEl, optionsContainerEl, skipValidation = false) {
            const hoveredPosition = hoveredEl.offsetTop
            const actualPosition = optionsContainerEl.scrollTop
            const heightContainer = optionsContainerEl.offsetHeight
            const heightHovered = hoveredEl.offsetHeight;

            if(skipValidation || hoveredPosition + heightHovered > actualPosition + heightContainer) {
                optionsContainerEl.scrollTop = hoveredPosition - heightContainer + heightHovered
            }
        },

        scrollToHoveredPrevious(hoveredEl, optionsContainerEl, skipValidation = false) {
            const hoveredPosition = hoveredEl.offsetTop
            const actualPosition = optionsContainerEl.scrollTop

            if(skipValidation || hoveredPosition < actualPosition) {
                optionsContainerEl.scrollTop = hoveredPosition
            }
        },

        setHoveredOption(key){
            this.hoveredOption = key
        },
        selectHoveredOption(){
            if(this.filteredOptions[this.hoveredOption])
                this.select(this.filteredOptions[this.hoveredOption])
        },
        loadOptionsByAjax(){

            if(this.ajaxOptionsFromField){
                
                this.$kompo.vlRequestFieldValue(this.kompoid, this.ajaxOptionsFromField, this.$_elKompoId)
                this.performAjax(this.$_getFromStore())

            }else{

                if(this.inputValue.length >= this.ajaxMinSearchLength){
                    this.performAjax()
                }else{
                    this.component.options = []
                    this.filteredOptions = []
                    this.optionsMessage = this.enterMoreCharacters
                }
            }
        },
        performAjax(search)
        {
            this.optionsMessage = '<i class="icon-spinner"/>'
            var initialSearch = search || this.inputValue

            this.$_kAxios.$_searchOptions(initialSearch).then(response => {

                if(!search && (initialSearch !== this.inputValue))
                    return
                
                if(!_.isArray(response.data))
                    return

                this.$set(this.component, 'options', response.data)
                this.$set(this, 'filteredOptions', response.data)
                this.optionsMessage = this.noOptionsFound
                this.optionsKey += 1

            })
        }
    }
}
</script>