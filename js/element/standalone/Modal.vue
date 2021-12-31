<template>
    <div 
        class="fixed inset-0 flex-center"
        tabindex="0"
        @keydown.left="previous"
        @keydown.right="next"
        @mousedown="mouseDown" 
        @mouseup="mouseUp"
        :style="{'z-index': zIndex - 2 }">

        <div class="vlModalClose" :style="{'z-index': zIndex + 2 }" @click.stop="closeAction">
          <i class="icon-times-circle"></i>
        </div>

        <i v-if="arrows" class="vlModalBtn icon-chevron-left" 
            @mouseup.stop="previous" />

        <i v-if="arrows" class="vlModalBtn icon-chevron-right" 
            @mouseup.stop="next" />

        <section 
            class="kompoFloat kompoModal" 
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
