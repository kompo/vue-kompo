<template>
    <v-sheet height="600">
	    <v-sheet
	      tile
	      height="54"
	      class="d-flex"
	    >
	      <v-btn
	        icon
	        class="ma-2"
	        @click="$refs.calendar.prev()"
	      >
	        <v-icon>mdi-chevron-left</v-icon>
	      </v-btn>
	      <v-select
	        v-model="type"
	        :items="types"
	        dense
	        outlined
	        hide-details
	        class="ma-2"
	        label="type"
	      ></v-select>
	      <v-btn
	        icon
	        class="ma-2"
	        @click="$refs.calendar.next()"
	      >
	        <v-icon>mdi-chevron-right</v-icon>
	      </v-btn>
	    </v-sheet>
      <v-calendar
        ref="calendar"
        v-model="value"
        category-show-all
        :weekdays="weekday"
        :type="type"
        :events="events"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        @change="getEvents"
        @click:event="showEvent"
      ></v-calendar>
    </v-sheet>
</template>

<script>
import Layout from '../mixins/Layout'

export default {
    mixins: [Layout],
    created(){
    	this.events = _.map(this.items, 'komponents')
    },
    data: () => ({
      type: 'month',
      types: ['month', 'week', 'day', '4day', 'category'],
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      value: '',
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    }),
    methods: {
      getEvents ({ start, end }) {
      	this.$emit('change', { start, end })
      },
      getEventColor(event){
      	return event.color
      },
      showEvent(event){
      	console.log(event)
      }
  	}
}
</script>
