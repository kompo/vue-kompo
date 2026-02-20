export default {
    data() {
        return {
            $_socketSubscriptions: [],
            $_socketHideTimeout: null,
            $_socketCounterValue: null,
            $_socketPresenceUsers: [],
        }
    },
    mounted() {
        this.$_setupSocketEvents()
        this.$_setupSocketBinding()
        this.$_setupSocketStream()
        this.$_setupSocketVisibility()
        this.$_setupSocketCounter()
        this.$_setupSocketPresence()
        this.$_setupSocketWhisper()
        this.$_setupSocketWhisperListen()
    },
    beforeDestroy() {
        this.$_cleanupSocketEvents()
    },
    methods: {
        // --- Core: onSocketEvent interaction ---
        $_setupSocketEvents() {
            const socketConfig = this.$_config('socketEvent')
            if (!socketConfig) return

            const channel = this.$_getEchoChannel(socketConfig.channel, socketConfig.type)
            if (!channel) return

            const events = socketConfig.events || (socketConfig.event ? [socketConfig.event] : ['KompoEvent'])

            events.forEach(event => {
                const eventName = event.startsWith('.') ? event : '.' + event
                channel.listen(eventName, (e) => {
                    this.$_runOwnInteractions('socketEvent', { response: { data: e } })
                })
                this.$data.$_socketSubscriptions.push({ channel: socketConfig.channel, event: eventName, type: socketConfig.type })
            })
        },

        // --- Feature: bindToEvent ---
        $_setupSocketBinding() {
            const binding = this.$_config('socketBinding')
            if (!binding) return

            const channel = this.$_getEchoChannel(binding.channel, 'private')
            if (!channel) return

            const eventName = (binding.event || 'KompoEvent').startsWith('.') ? binding.event : '.' + (binding.event || 'KompoEvent')

            channel.listen(eventName, (e) => {
                let value = binding.dataKey ? _.get(e, binding.dataKey) : e

                if (binding.format === 'currency' && typeof value === 'number') {
                    value = '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                }

                // Update field value if it has one, otherwise update label/content
                if (this.component.value !== undefined) {
                    this.component.value = value
                } else {
                    this.component.label = String(value)
                }
            })
            this.$data.$_socketSubscriptions.push({ channel: binding.channel, event: eventName, type: 'private' })
        },

        // --- Feature: appendOnEvent / prependOnEvent ---
        $_setupSocketStream() {
            const stream = this.$_config('socketStream')
            if (!stream) return

            const channel = this.$_getEchoChannel(stream.channel, 'private')
            if (!channel) return

            const eventName = (stream.event || 'KompoEvent').startsWith('.') ? stream.event : '.' + (stream.event || 'KompoEvent')

            channel.listen(eventName, (e) => {
                const content = stream.dataKey ? _.get(e, stream.dataKey) : e
                if (!content) return

                const el = this.$el
                if (stream.mode === 'prepend') {
                    el.insertAdjacentHTML('afterbegin', content)
                } else {
                    el.insertAdjacentHTML('beforeend', content)
                }
            })
            this.$data.$_socketSubscriptions.push({ channel: stream.channel, event: eventName, type: 'private' })
        },

        // --- Feature: showOnEvent / hideOnEvent / toggleOnEvent ---
        $_setupSocketVisibility() {
            const visibility = this.$_config('socketVisibility')
            if (!visibility) return

            const channel = this.$_getEchoChannel(visibility.channel, 'private')
            if (!channel) return

            const eventName = (visibility.event || 'KompoEvent').startsWith('.') ? visibility.event : '.' + (visibility.event || 'KompoEvent')

            channel.listen(eventName, () => {
                if (visibility.action === 'show') {
                    this.$el.classList.remove('hidden')
                } else if (visibility.action === 'hide') {
                    this.$el.classList.add('hidden')
                } else if (visibility.action === 'toggle') {
                    this.$el.classList.toggle('hidden')
                }
            })
            this.$data.$_socketSubscriptions.push({ channel: visibility.channel, event: eventName, type: 'private' })
        },

        // --- Feature: liveCount / liveCountDown ---
        $_setupSocketCounter() {
            const counter = this.$_config('socketCounter')
            const counterDown = this.$_config('socketCounterDown')

            if (counter) {
                this.$_setupSingleCounter(counter)
            }
            if (counterDown) {
                this.$_setupSingleCounter(counterDown)
            }
        },
        $_setupSingleCounter(config) {
            const channel = this.$_getEchoChannel(config.channel, 'private')
            if (!channel) return

            const eventName = (config.event || 'KompoEvent').startsWith('.') ? config.event : '.' + (config.event || 'KompoEvent')

            // Initialize counter from current label
            if (this.$data.$_socketCounterValue === null) {
                this.$data.$_socketCounterValue = parseInt(this.component.label) || 0
            }

            channel.listen(eventName, (e) => {
                if (config.dataKey) {
                    // Use value from event payload
                    const val = _.get(e, config.dataKey)
                    if (val !== undefined) {
                        this.$data.$_socketCounterValue = Number(val)
                    }
                } else {
                    // Increment or decrement by 1
                    if (config.mode === 'decrement') {
                        this.$data.$_socketCounterValue--
                    } else {
                        this.$data.$_socketCounterValue++
                    }
                }
                this.component.label = String(this.$data.$_socketCounterValue)
            })
            this.$data.$_socketSubscriptions.push({ channel: config.channel, event: eventName, type: 'private' })
        },

        // --- Feature: withPresence / presenceCount ---
        $_setupSocketPresence() {
            const presence = this.$_config('socketPresence')
            if (!presence) return

            if (typeof Echo === 'undefined') return

            const ch = Echo.join(presence.channel)

            ch.here((users) => {
                this.$data.$_socketPresenceUsers = users
                this.$_updatePresenceDisplay(presence.mode)
            }).joining((user) => {
                this.$data.$_socketPresenceUsers.push(user)
                this.$_updatePresenceDisplay(presence.mode)
            }).leaving((user) => {
                this.$data.$_socketPresenceUsers = this.$data.$_socketPresenceUsers.filter(u => u.id !== user.id)
                this.$_updatePresenceDisplay(presence.mode)
            })

            this.$data.$_socketSubscriptions.push({ channel: presence.channel, type: 'presence' })
        },
        $_updatePresenceDisplay(mode) {
            if (mode === 'count') {
                this.component.label = String(this.$data.$_socketPresenceUsers.length)
            }
            // For 'list' mode, the socketEvent interaction will trigger selfGet with user data
        },

        // --- Feature: whisperOnInput ---
        $_setupSocketWhisper() {
            const whisper = this.$_config('socketWhisper')
            if (!whisper) return

            if (typeof Echo === 'undefined') return

            const ch = Echo.private(whisper.channel)

            // Store the channel for whisper sending
            this.$_whisperChannel = ch
            this.$_whisperEvent = whisper.event
        },

        // --- Feature: showOnWhisper ---
        $_setupSocketWhisperListen() {
            const listen = this.$_config('socketWhisperListen')
            if (!listen) return

            if (typeof Echo === 'undefined') return

            const ch = Echo.private(listen.channel)
            const hideAfter = this.$_config('hideAfter')

            ch.listenForWhisper(listen.event, () => {
                if (listen.action === 'show') {
                    this.$el.classList.remove('hidden')
                }

                // Auto-hide after delay
                if (hideAfter) {
                    if (this.$data.$_socketHideTimeout) {
                        clearTimeout(this.$data.$_socketHideTimeout)
                    }
                    this.$data.$_socketHideTimeout = setTimeout(() => {
                        this.$el.classList.add('hidden')
                    }, hideAfter)
                }
            })

            this.$data.$_socketSubscriptions.push({ channel: listen.channel, type: 'whisper' })
        },

        // --- Helper: get Echo channel by type ---
        $_getEchoChannel(channelName, type) {
            if (typeof Echo === 'undefined') return null

            switch (type) {
                case 'public':
                    return Echo.channel(channelName)
                case 'presence':
                    return Echo.join(channelName)
                default:
                    return Echo.private(channelName)
            }
        },

        // --- Whisper trigger (called from input event) ---
        $_triggerWhisper() {
            if (this.$_whisperChannel && this.$_whisperEvent) {
                this.$_whisperChannel.whisper(this.$_whisperEvent, {
                    user: window._kompo?.user || null,
                })
            }
        },

        // --- Cleanup ---
        $_cleanupSocketEvents() {
            if (typeof Echo === 'undefined') return

            this.$data.$_socketSubscriptions.forEach(sub => {
                if (sub.type === 'presence') {
                    Echo.leave(sub.channel)
                } else if (sub.event) {
                    // Stop listening to specific events
                    Echo.private(sub.channel).stopListening(sub.event)
                }
            })
            this.$data.$_socketSubscriptions = []

            if (this.$data.$_socketHideTimeout) {
                clearTimeout(this.$data.$_socketHideTimeout)
            }
        },
    },
}
