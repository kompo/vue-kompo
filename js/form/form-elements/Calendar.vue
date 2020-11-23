<template>
    <div class="VlCalendar">
        <div ref="calendar" />
    </div>
</template>

<script>
import Trigger from '../mixins/Trigger'
import Flatpickr from 'flatpickr'
export default {
    mixins: [Trigger],
    mounted(){
        var a = new Flatpickr(this.$refs.calendar, {
            inline: true,
            onDayCreate: function(dObj, dStr, fp, dayElem){
                // Utilize dayElem.dateObj, which is the corresponding Date

                // dummy logic
                if (Math.random() < 0.15)
                    dayElem.innerHTML += "<span class='text-red-500'>x</span>";

                else if (Math.random() > 0.85)
                    dayElem.innerHTML += "<span class='text-red-500'>e</span>";
            }
        })
    }
}
</script>
<style lang="scss">
.VlCalendar{
    .flatpickr-calendar {
        width: 100%;
    }
    .flatpickr-days {width: 100%;}
    .dayContainer {
      width: 100%;
      min-width: none;
      max-width: none;
    }
}
</style>