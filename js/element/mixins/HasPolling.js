export default {
    data() {
        return {
            $_pollingIntervals: [],
            $_pollingTimeouts: [],
        }
    },
    mounted() {
        this.$_setupPolling()
    },
    beforeDestroy() {
        this.$_cleanupPolling()
    },
    methods: {
        $_setupPolling() {
            if (!this.$_hasInteractions) return

            this.$_interactions.forEach(interaction => {
                if (interaction.interactionType !== 'load') return

                const pollingInterval = _.get(interaction, 'action.config.pollingInterval')
                if (!pollingInterval) return

                const intervalId = setInterval(() => {
                    this.$_runAction(interaction.action)
                }, pollingInterval)

                this.$data.$_pollingIntervals.push(intervalId)
            })
        },
        $_stopPolling() {
            this.$_cleanupPolling()
        },
        $_cleanupPolling() {
            this.$data.$_pollingIntervals.forEach(id => clearInterval(id))
            this.$data.$_pollingIntervals = []

            this.$data.$_pollingTimeouts.forEach(id => clearTimeout(id))
            this.$data.$_pollingTimeouts = []
        },
    },
}
