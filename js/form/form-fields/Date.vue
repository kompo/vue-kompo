<template>
    <vl-form-field v-bind="$_wrapperAttributes" @labelclick="focus">

        <div class="vlInputGroup">
            <div class="vlInputPrepend" @click.stop="openCalendar" v-html="$_icon" />
            <flat-pickr 
                v-model="component.value"                                                    
                class="vlFormControl"
                ref="flatpickr"
                v-bind="$_attributes"
                v-on="$_events" 
                autocomplete="off" />
            <div class="vlInputAppend" v-if="!$_readOnly">
                <i v-if="$_value" class="icon-times" @click.stop="clear" />
            </div>
        </div>

    </vl-form-field>
</template>

<script>
import Field from '../mixins/Field'

import flatPickr from 'vue-flatpickr-component'; 
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate'
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/airbnb.css';

import { French } from "flatpickr/dist/l10n/fr.js"

export default {
    mixins: [Field],
    components: { flatPickr },
    data(){
        return {
            dateCheck: null,
            selectedDates: null, //for storing date range values...otherwise fp makes a string with ...to... (translated)
        }
    },
    mounted(){
        this.fixDateValue() //for some reason flatpickr converts to UTC randomly...

        this.dateCheck = this.$_value //to emit accurate change events
        this.selectedDates = this.$_value
    },
    computed: {
        $_enableTime(){ return this.$_config('enableTime') || false },
        $_noCalendar(){ return this.$_config('noCalendar') || false },
        $_dateMode(){ return this.$_config('dateMode') || false },
        $_locale(){ return this.$_config('kompo_locale') },
        $_dateFormat(){ return this.$_config('dateFormat') },
        $_attributes(){
            return {
                ...this.$_defaultFieldAttributes,
                config: Object.assign({
                    wrap: true,
                    dateFormat: this.$_dateFormat,
                    enableTime: this.$_enableTime,
                    plugins: this.$_enableTime ? [new confirmDatePlugin({confirmIcon: ''})] : [],
                    noCalendar: this.$_noCalendar,
                    allowInput: true,
                    altInput: true,
                    altInputClass: 'vlFormControl',
                    altFormat: this.$_config('altFormat'),
                    time_24hr: true
                }, 
                    this.$_dateMode ? {mode: this.$_dateMode} : {},
                    (this.$_locale == 'fr') ? {locale: French} : {},
                ),
                disabled: this.$_readOnly ? true : false
            }
        },
        $_events() { 
            return {
                ...this.$_defaultFieldEvents,
                blur: () => {}, //had to disable blur action because it was making me click twice on the calendar
                change: () => {},
                'on-change': this.onChange,
                'on-open': this.onOpen,
                'on-close': this.onClose
            }
        }
    },
    methods:{
        //useful methods if needed
        //this.$refs.flatpickr.fp._input.focus()
        //this.$refs.flatpickr.fp.close()
        openCalendar(){
            this.$refs.flatpickr.fp.open()
        },        
        $_fill(jsonFormData){
            if((this.$_dateMode == 'range')) {
                (this.selectedDates || [null,null]).forEach((value, key) => {
                    let name = _.isArray(this.$_name) ? this.$_name[key] : (this.$_name+'['+key+']')
                    jsonFormData[name] = _.isNil(this.$_value) ? '' : value
                })
            }else{
                jsonFormData[this.$_name] = _.isNil(this.$_value) ? '' : this.$_value
            }
        },
        focus(){
            this.$refs.flatpickr.fp.showTimeInput = true //fix to show time in datetime
            if(this.$_noCalendar) //for Time, we want it to focus to the hour input
                setTimeout( () => this.$refs.flatpickr.fp.hourElement.focus(), 50)
            this.$_focusAction()
        },
        onChange(selectedDates, dateStr, instance) {

            if(this.$_dateMode == 'range'){
                if(selectedDates.length == 1){
                    return //emit only when both are selected
                }

                this.selectedDates = selectedDates.map((date) => instance.formatDate(date,this.$_config('dateFormat')))
            }

            if(dateStr == this.dateCheck) //Flatpickr emits even if the date does not change... had to do the check myself
                return

            this.$_clearErrors()
            this.dateCheck = dateStr
            setTimeout(() => {
                this.$_changeAction()

                this.$emit('change', dateStr, event) //there's a magical event variable that is defined when a date changes but not when time changes. seen on SO. used for tasks in condoedge
            }, 100)
        },
        clear(){
            this.component.value = ''
            this.$_blurAction()
            this.$_changeAction()
        },
        onOpen(obj, value){
            this.focus()
            this.$emit('open', value, event)
        },
        onClose(obj, value){
            this.$emit('close', value, event)
            this.$_blurAction()
        },
        fixDateValue(){
            if (!this.$_value || !_.isString(this.$_value)){
                return
            }

            if (this.$_dateFormat == 'Y-m-d') {
                this.component.value = this.$_value.substr(0, 10)
            }

            if (this.$_dateFormat == 'Y-m-d H:i') {
                this.component.value = this.$_value.substr(0, 16)
            }
        }
    }
}
</script>

