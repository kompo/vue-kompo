<template>

   <div 
   		v-if="!$_displayNone" 
        v-show="!$_hidden" 
        v-bind="$_attributes"
    >
        <div class="vl-center-knob"></div>
        <div ref="hours" class="vl-hand vl-hand-hour"></div>
        <div ref="minutes" class="vl-hand vl-hand-minute"></div>
        <div ref="seconds" class="vl-hand vl-hand-seconds"></div>
    </div>

</template>

<script>
import Other from '../form/mixins/Other'

export default {
    mixins: [Other],
    mounted(){
    	setInterval(this.getTime, 1000)
    },
    methods: {
    	getTime(){

			const now = new Date();

			const seconds = now.getSeconds();
			const secondsDegree = (((seconds / 60) * 360) + 90);
			this.$refs.seconds.style.transform = 'rotate('+secondsDegree+'deg)'


			const minutes = now.getMinutes();
			const minutesDegree = (((minutes / 60) * 360) + 90);
			this.$refs.minutes.style.transform = 'rotate('+minutesDegree+'deg)'


			const hours = now.getHours();
			const hoursDegree = (((hours / 12) * 360) + 90);
			this.$refs.hours.style.transform = 'rotate('+hoursDegree+'deg)'
		}
    }
}
</script>