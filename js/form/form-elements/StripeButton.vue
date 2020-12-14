<template>
    <vl-button 
        v-bind="$_attributes"
        @stripeRedirect="redirectCheckout" />
</template>

<script>
import Trigger from '../mixins/Trigger'
export default {
    mixins: [Trigger],
    data(){
        return {
            stripe: undefined
        }
    },
    computed:{
        $_attributes(){
            return {
                ...this.$_defaultTriggerAttributes,
                vkompo: this.vkompo,
                kompoid: this.kompoid
            }
        },

    },
    methods: {
        redirectCheckout(response){
            
            const result = this.stripe.redirectToCheckout({ sessionId: response.id })

            if (result.error) {
                alert(result.error.message)
            }
        }
    },
    mounted(){
        let stripeScript = document.createElement('script')

        console.log(process.env.MIX_STRIPE_KEY)

        stripeScript.onload = () => {

            this.stripe = typeof Stripe !== 'undefined' ? Stripe(process.env.MIX_STRIPE_KEY) : undefined

        }
        stripeScript.async = true
        stripeScript.setAttribute('src', 'https://js.stripe.com/v3/')
        document.head.appendChild(stripeScript)
    },
}
</script>
