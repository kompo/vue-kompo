<template>
    <div class="vlDeleteLinkModal">
        <h3>{{ deleteTitle }}</h3>
		<div>
		    <vl-button class="vlBtn vlBtnBlock" 
		    	:vkompo="vkompo"
                :kompoid="kompoid"
                :index="itemIndex"
                @deleted="deleted"
                v-html="confirmMessage"
            />
		    <button 
                type="button" 
                class="vlBtn vlBtnOutlined" 
                @click.stop="closeModal">{{ cancelMessage }}</button>
		</div>
    </div>
</template>

<script>
import BaseElement from '../../element/mixins/BaseElement'

export default {
    mixins: [BaseElement], // for $_elKompoId
    props: {
        kompoid: {type: String, required: true},
    },
    data(){
        return{
            itemIndex: ''
        }
    },
    computed:{
        deleteTitle(){
            return this.$_config('deleteTitle')
        },
    	confirmMessage(){
    		return this.$_config('confirmMessage')
    	},
    	cancelMessage(){
    		return this.$_config('cancelMessage')
    	}
    },
    methods: {
        deleted(){
            this.$emit('closeModal')
        }
    },
    created(){
        this.itemIndex = this.component.itemIndex
    }
}
</script>

<style lang="scss" scoped>
.vlDeleteLinkModal{
    padding: 1rem;
    h3{
        margin-bottom: 1rem;
    }
    button{
        width: 10rem;
    }
    >div{
        width: 21rem;
        display: flex;
        justify-content: space-between;
    }
}
</style>
