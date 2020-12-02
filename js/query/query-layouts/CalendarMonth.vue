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
    		sortedItems: []
    	}
    },
    methods: {
    	dateId(dateStr){
    		return 'date-'+dateStr
    	},
        monthYearChange(instance){
            this.currentDate = instance.currentYear+'-'+instance.currentMonth+'-01'
            this.$kompo.vlBrowseQuery(this.$_elKompoId, null, {
                month: instance.currentMonth + 1, 
                year: instance.currentYear
            })
        },
        $_attributes(item, index) { 
            return {
                ...this.$_defaultLayoutAttributes(item, index),
                key: this.itemAttributes(item).event_type + this.itemAttributes(item).id //in case of multiple models with same id
            }
        }
    },
    mounted(){
        /* --- event object ---
         * required attributes: ['start_date']
         * optional attributes: ['event_type']
        */
    	var VueScrollTo = require('vue-scrollto')

    	this.sortedItems = _.groupBy(this.items, (item) => {
    		return this.itemAttributes(item).start_date.substr(0,10)
    	})

        var a = new Flatpickr(this.$refs.calendar, {
            
            inline: true,
            
            defaultDate: _.isEmpty(this.initial) ? null : (this.initial.year+'-'+this.initial.month+'-01'),

            onDayCreate: (dObj, dStr, fp, dayElem) => {
            	var date = dayElem.dateObj
            	//https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
            	const offset = date.getTimezoneOffset()
				date = new Date(date.getTime() - (offset*60*1000))
				date = date.toISOString().split('T')[0]

				if(this.sortedItems[date]){
                    var eventHints = ''
                    this.sortedItems[date].forEach((event) => {
                        let event_type = this.itemAttributes(event).event_type
                        let type_class = event_type ? (' class="'+event_type+'"') : ''
                        eventHints += '<div'+type_class+'></div>'
                    })
                    dayElem.innerHTML += '<div>'+eventHints+'</div>'
                }
            },
            onChange: (selectedDates, dateStr, instance) => {
            	this.$_vlEmitFrom('selected', {date : dateStr})

            	var scroll = this.$scrollTo('#'+this.dateId(dateStr), 300, { container: ".vlEventsList" })
            },
            onMonthChange: (selectedDates, dateStr, instance) => {
                this.monthYearChange(instance)
            },
            onYearChange: (selectedDates, dateStr, instance) => {
                this.monthYearChange(instance)
            },
        })
    }
}
</script>
<style lang="scss">
.VlCalendarMonth{
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
	height: 40vh;
	overflow-y: auto; 
}
</style>
