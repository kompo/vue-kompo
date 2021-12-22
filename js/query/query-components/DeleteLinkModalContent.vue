<template>
    <div class="vlDeleteLinkModal">
        <h3>{{ deleteTitle }}</h3>
		<div v-if="!deletedMessage">
		    <vl-button class="vlBtn vlBtnBlock" 
		    	:vkompo="vkompo"
                :kompoid="kompoid"
                :index="index"
		    	@deleted="deleted"
                v-html="confirmMessage"
            />
		    <button 
                type="button" 
                class="vlBtn vlBtnOutlined" 
                @click.stop="closeModal">{{ cancelMessage }}</button>
		</div>
        <div v-else v-html="deletedMessage" />
    </div>
</template>

<script>
import BaseElement from '../../element/mixins/BaseElement'

export default {
    mixins: [BaseElement], // for $_elKompoId
    props: {
        kompoid: {type: String, required: true},
        index: {type: Number} //because addlink doesn't have an index
    },
    data(){
        return{
            deletedMessage: ''
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
    	closeModal(){
    		this.$emit('closeModal')
    	},
        deleted(){
            //this.$emit('refresh', this.index) //-> discontinued... now we remove item in Front-end only
            this.$kompo.vlEmitFrom(this.$_elKompoId, 'deleted') //emit to DeleteLink
            this.closeModal()
        }
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
