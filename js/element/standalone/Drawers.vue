<template>
    <transition name="fadeIn">
        <div class="vlMask" v-show="drawers.length">
            <transition-group name="slideLeft">
                <vl-drawer
                    v-for="(drawer, key) in drawers"
                    :key="drawer.id"
                    :obj="drawer.obj"
                    :kompoid="drawer.kompoid"
                    :options="drawer.options"
                    @close="closeLast"
                    @confirmSubmit="confirmSubmit"
                />
            </transition-group>
        </div>
    </transition>
</template>

<script>
import EmitsEvents from '../mixins/EmitsEvents'

export default {
    mixins: [EmitsEvents],
    data(){
        return {
            drawers: [],
            initialId: 0,
            confirmSubmitFunction: null,
        }
    },
    computed:{

    },
    methods:{
        addDrawer(obj, kompoid, options){

            this.initialId += 1
            
            this.$nextTick(() => this.drawers.push({
                id: 'vl-drawer-'+this.initialId,
                obj: obj,
                kompoid: kompoid,
                options: Object.assign(options, {
                    zIndex: 1000 + 100*this.initialId,
                }),
            }))
        },
        closeByIndex(index){
            this.drawers.splice(index)
        },
        closeLast(){
            this.closeByIndex(this.drawers.length-1)
            this.initialId -= 1
        },
        confirmSubmit(){
            this.confirmSubmitFunction()
        },
        $_attachEvents(){
            this.$_vlOn('vlFillDrawer', (response, kompoid, options) => {
                this.confirmSubmitFunction = options.confirmFunc
                this.addDrawer(response.data, kompoid, options)
            })
            this.$_vlOn('vlCloseDrawer', () => {
                this.closeByIndex(this.drawers.length-1)
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
              'vlFillDrawer',
              'vlCloseDrawer'
            ])
        }

    },
    created(){
        this.$_destroyEvents()
        this.$_attachEvents()
    },
    updated() {
        this.$_destroyEvents()
        this.$_attachEvents()
    }
}
</script>
