<template>
<section 
    class="absolute inset-y-0 right-0 max-w-full flex" 
    v-click-out="closeMe">
    <div class="relative w-screen max-w-md">
        <div class="absolute top-0 right-0 mr-4">
          <button aria-label="Close panel" 
            @click="closeMe"
            class="text-4xl text-gray-400 transition ease-in-out duration-150">
            <i class="icon-times-circle"></i>
          </button>
        </div>
        <div class="h-full flex flex-col space-y-6 py-6 bg-white shadow-xl overflow-y-scroll">
            <component 
                v-if="partial" :is="partial" 
                :vkompo="component" />
        </div>
    </div>
</section>
</template>

<script>
import HasVueComponent from '../mixins/HasVueComponent'

export default {
    mixins: [HasVueComponent],
    props: {
        obj: { type: Object, required: true },
        index: { type: String, required: true },
    },
    data(){
        return {
            component: null,
            partial: null
        }
    },
    methods: {
        closeMe(){
            this.$emit('close', this.index)
        },
        insertFromResponse(){
            this.component = this.obj
            this.partial = this.$_getKomposerTemplate(this.obj)
        }
    },
    created(){
        this.insertFromResponse()
    }
}
</script>
