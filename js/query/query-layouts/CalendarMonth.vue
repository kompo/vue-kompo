<template>
    <div class="VlCalendarMonth">
        <div ref="calendar" />
        <div class="vlEventsList mini-scroll">
        	<template v-for="(events, eventsDate) in sortedItems">
                <div class="font-bold text-xs text-gray-500 pb-2 pt-4" 
                	:id="dateId(eventsDate)"
                	v-html="eventsDate"  />
                <template v-for="(event, index) in events">
                	<component v-bind="$_attributes(event, eventsDate+(index+1))" />
                </template>
            </template>
        </div>
    </div>
</template>

<script>
import Layout from '../mixins/Layout'
import Flatpickr from 'flatpickr'

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
    methods: {
    	dateId(dateStr){
    		return 'date-'+dateStr
    	},
        dayChange(selectedDates, dateStr, instance){
            this.$_vlEmitFrom('selected', {date : dateStr}) //Emits to parent komposer for doing more actions

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
        $_attributes(item, index) { 
            return {
                ...this.$_defaultLayoutAttributes(item, index),
                key: this.itemAttributes(item).event_class + this.itemAttributes(item).id //in case of multiple models with same id
            }
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

        var fp = new Flatpickr(this.$refs.calendar, {
            
            inline: true,
            
            defaultDate: this.selectedDate,

            onDayCreate: this.createDate,
            onChange: this.dayChange,
            onMonthChange: this.monthYearChange,
            onYearChange: this.monthYearChange,
        })

        this.scrollToDate()
    }
}
</script>
<style lang="scss">
.VlCalendarMonth{
    max-height: 100vh;
    display: flex;
    flex-direction: column;
    .flatpickr-calendar {
        width: 100%;
    }
    .flatpickr-days {width: 100%;}
    .dayContainer {
      width: 100%;
      min-width: none;
      max-width: none;
    }
    .flatpickr-rContainer{
    	width: 100%;
    }
    .flatpickr-day{
        overflow: hidden;
        >div{
        	position: absolute;
        	top: 5px;
        	right: 5px;
        	border-radius: 50%;
        	height: 0.3rem;
        	width: 0.3rem;
        	background-color: gray;
            >div{
                height: 100%;
                border-radius: 50%;
                margin-bottom: 2px;
            }
        }
    }
}
.vlEventsList{
	overflow-y: auto; 
}
</style>
