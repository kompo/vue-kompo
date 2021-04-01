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

<style>
.vlClock {
    width: 6vw;
    height: 6vw;
    min-width: 6rem;
    min-height: 6rem;
    border-radius: 100%;
    position: relative;
    padding: 0.5rem;
    border: 2px solid white;
}

.vl-hand {
    width: 40%;
    height: 2%;
    top: 49%;
    left: 10%;
    background: white;
    position: absolute;
    transform-origin: 100%;
    transform: rotate(90deg);
    border-radius: 15%;
}
.vl-hand-hour{
    width: 28%;
    left: 22%;
    height: 4%;
    top: 48%;
}
.vl-hand-minute{
    height: 4%;
    top: 48%;
}
.vl-center-knob{
    background: white;
    border-radius: 50%;
    top: 0;bottom: 0;left: 0;right: 0;
    margin: 46%;
    height: 8%;
}
</style>