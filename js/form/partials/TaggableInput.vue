<template>
    <div class="vlTaggableInput">

        <div v-if="$slots.prepend" class="vlInputPrepend" @click.stop="$emit('click')">
            <slot name="prepend" />
        </div>

        <div class="vlTaggableContent">
            <div v-if="selections.length"
                :class="{vlTags: multiple, vlSingle: !multiple}" 
                style="width: 100%"
                @click.stop="$emit('click')">
                <div v-for="(selection, index) in selections" 
                    :key="uniqueKey(selection)"
                    class="vlCustomLabel truncate"
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
    },
    methods: {
        uniqueKey(selection){
            return selection[this.valueKey]
            //return this.hashCode(selection)
        }
    }
}
</script>