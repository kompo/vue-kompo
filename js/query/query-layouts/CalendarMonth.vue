<template>
    <div class="VlCalendarMonth">
        <div ref="calendar" />
        <div class="vlEventsList mini-scroll">
        	<template v-for="(events, eventsDate) in sortedItems">
                <div class="font-bold text-xs text-gray-500 pb-2 pt-4" 
                	:id="dateId(eventsDate)"
                	v-html="eventsDate"
                />
                <component 
                    v-for="(event, index) in events"
                    :key="itemKey(event)"
                    v-bind="$_attributes(event, eventsDate+(index+1))" 
                />
            </template>
        </div>
    </div>
</template>

<script>
import Layout from '../mixins/Layout'
import Flatpickr from 'flatpickr'

import { French } from "flatpickr/dist/l10n/fr.js"

export default {
    mixins: [Layout],
    props: {
        initial: {type: Object}
    },
    data(){
    	return {
    		sortedItems: [],
            selectedDate: null //for rescrolling into view on month/year change
    	}
    },
    computed: {
        $_locale(){ return this.$_config('kompo_locale') },
    },
    methods: {
        defaultKey(item){ return (this.itemAttributes(item).event_class + this.itemAttributes(item).id) || null },
    	dateId(dateStr){
    		return 'date-'+dateStr
    	},
        dayChange(selectedDates, dateStr, instance){
            this.$_vlEmitFrom('selected', {date : dateStr}) //Emits to parent komponent for doing more actions

            this.selectedDate = dateStr

            this.scrollToDate()
        },
        monthYearChange(selectedDates, dateStr, instance){

            this.selectedDate = this.formatDate(selectedDates[0]) != dateStr ? //arrow changing

                                    this.formatDate(selectedDates[0]) : 

                                    this.formatDate(new Date(instance.currentYear, instance.currentMonth, 1))

            this.$kompo.vlBrowseQuery(this.$_elKompoId, null, {
                month: instance.currentMonth + 1, 
                year: instance.currentYear,
                selectedDate: this.selectedDate
            })
        },
        scrollToDate() {
            this.$nextTick(() => {
                
                let id = this.dateId(this.selectedDate)

                if( document.getElementById(id) )
                    this.$scrollTo('#'+id, 300, { container: ".vlEventsList" }) 
            })
        },
        createDate(dObj, dStr, fp, dayElem) {
            var dateStr = this.formatDate(dayElem.dateObj)

            if(this.sortedItems[dateStr]){
                var eventHints = ''
                this.sortedItems[dateStr].forEach((event) => {
                    let event_class = this.itemAttributes(event).event_class
                    let type_class = event_class ? (' class="'+event_class+'"') : ''
                    eventHints += '<div'+type_class+'></div>'
                })
                dayElem.innerHTML += '<div>'+eventHints+'</div>'
            }
        },
        formatDate(date){            
            //https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
            const offset = date.getTimezoneOffset()
            date = new Date(date.getTime() - (offset*60*1000))
            return date.toISOString().split('T')[0]
        }
    },
    created(){   
        var VueScrollTo = require('vue-scrollto')

        this.selectedDate = _.isEmpty(this.initial) ? 
                                this.formatDate(new Date()) : //today
                                this.initial.selectedDate

    },
    mounted(){
        /* --- event object ---
         * required attributes: ['start_date']
         * optional attributes: ['event_class']
        */

    	this.sortedItems = _.groupBy(

            _.sortBy(this.items, (item) => this.itemAttributes(item).start_date), 

            (item) => this.itemAttributes(item).start_date.substr(0,10)
        )

        var fp = new Flatpickr(this.$refs.calendar, Object.assign({
            
            inline: true,
            
            defaultDate: this.selectedDate,

            onDayCreate: this.createDate,
            onChange: this.dayChange,
            onMonthChange: this.monthYearChange,
            onYearChange: this.monthYearChange,
        },
            (this.$_locale == 'fr') ? {locale: French} : {},
        ))

        this.scrollToDate()
    }
}
</script>
