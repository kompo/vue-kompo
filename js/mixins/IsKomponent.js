export default {
    created(){
        window._kompo.sessionTimeoutMessage = this.$_config('sessionTimeoutMessage')
    },
	computed: {

        $_kompoInfo() { return this.$_config('X-Kompo-Info') },

        $_deliverKompoInfoOff() { return 'vlGetKomponentInfo'+this.$_elKompoId },

        $_pusherRefresh(){ return this.component.pusherRefresh },

        $_isLive(){ return window._kompo.komponents.includes(this.$_elKompoId) },

    },
    methods:{
        $_deliverKompoInfoOn(){
            this.$_vlOn('vlGetKomponentInfo'+this.$_elKompoId, (askerId) => {

                this.$kompo.vlDeliverKompoInfo(askerId, this.$_kompoInfo)
                
            })
        },
        $_configureEcho(){

            if(!this.$_pusherRefresh)
                return

            Object.keys(this.$_pusherRefresh).forEach((key) => {

                this.$_pusherRefresh[key].forEach((message) => {

                    window._kompo.echo.push({
                        channel: key, message: message //saving specs for stopListening later
                    })

                    Echo.private(key).listen(message, (e) => {
                        
                        this.$_echoTrigger()

                    })

                })
            })
        },
        $_saveLiveKomponent(){
            window._kompo.komponents.push(this.$_elKompoId)       
        },
        $_removeLiveKomponent(){
            window._kompo.komponents = _.filter(window._kompo.komponents, (n) => n !== this.$_elKompoId)
        },
        $_echoTrigger(){}, //to be overriden in Komponent
    }
}