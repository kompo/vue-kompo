<template>
    <div class="vlTaggableInput" ref="content">

        <div v-if="$slots.prepend" class="vlInputPrepend" @click.stop="$emit('click')">
            <slot name="prepend" />
        </div>

        <div class="vlTaggableContent" :style="{width: contentWidth}">
            <div v-if="selections.length"
                :class="{vlTags: multiple, vlSingle: !multiple}" 
                style="width: 100%"
                @click.stop="$emit('click')">
                <div v-for="(selection, index) in selections" 
                    :key="uniqueKey(selection)"
                    class="vlCustomLabel"
                    @click.stop="$emit('click', selection)">
                    <i v-if="!readonly"
                        class="icon-times" 
                        @click.stop="$emit('remove', index)" />
                    <vlCustomLabel 
                        :vkompo="selection[labelKey]" 
                        :kompoid="kompoid"/>
                </div>
            </div>

            <slot />
        </div>

        <div v-if="$slots.append" class="vlInputAppend" @click.stop="$emit('click')">
            <slot name="append" />
        </div>

    </div>
</template>

<script>
import HashesObjects from '../../element/mixins/HashesObjects'

export default {
    mixins: [ HashesObjects ],
    props: {
        selections: {type: Array, required: true},
        kompoid: { type: String, required: false },
        multiple: {type: Boolean, default: false },
        labelKey: {type: String, default: 'label'},
        valueKey: {type: String, default: 'value'},
        readonly: {type: Boolean, default: false },
        width: { type: String, required: false }, 
    },
    data(){
        return {
            contentWidth: 0
        }
    },
    mounted(){
        this.setContentWidth()
        window.addEventListener('resize', this.setContentWidth)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.setContentWidth)
        this.$kompo.events.$off('vlTabChange')
    },
    created() {
        this.$kompo.events.$on('vlTabChange', () => {
            this.$nextTick(()=> { this.setContentWidth() }) //TODO: not on any tabchange... actually this contentwidth setting should be avoided in the first place
        })
    },
    methods: {
        setContentWidth(){
            if(this.width){
                this.contentWidth = this.width
                return
            }

            if(!this.$refs.content)
                return
            this.contentWidth = 'auto' //necessary cuz content depends in the width of it's contents...
            this.$nextTick(()=> {this.contentWidth = parseInt(this.$refs.content.clientWidth - 32) + 'px'})
        },
        uniqueKey(selection){
            return selection[this.valueKey]
            //return this.hashCode(selection)
        }
    }
}
</script>