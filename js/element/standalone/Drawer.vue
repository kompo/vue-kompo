<template>
    <div 
        class="fixed inset-0"
        tabindex="0"
        @mousedown="mouseDown" 
        @mouseup="mouseUp"
        :style="{'z-index': zIndex - 2 }">

        <div class="vlDrawerClose" :style="{'z-index': zIndex + 2 }" @click.stop="closeAction">
            <i class="icon-times"></i>
        </div>

        <section 
            class="kompoFloat kompoDrawer" 
            ref="floatingContainer">

            <template v-for="(row,index) in elements">
                <component 
                    v-bind="$_attributes(row)" 
                    @closeModal="closeAction"
                    @confirmSubmit="confirmSubmit"
                    @touchedForm="handleTouchedForm"  
                    @success="handleSubmitSuccess"
                />
            </template>

        </section>
    </div>
</template>

<script>
import IsFloating from '../mixins/IsFloating'

export default {
    mixins: [IsFloating],
}
</script>
