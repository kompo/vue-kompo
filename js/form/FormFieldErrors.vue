<template>

    <div v-if="errorText" class="vlFieldErrors" v-html="errorText" />

</template>

<script>

export default {
    props: ['errors'],
    
    computed: {
        errorText() {
            if (this.errors && this.errors.length) 
                return this.errors[0]

                //return this.errors.join('<br>') //1 is enough, maybe 2 max...
        }
    }
}
</script>
