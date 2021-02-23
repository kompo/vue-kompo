export default {
	computed: {

        $_kompoInfo() { return this.$_config('X-Kompo-Info') },

        $_deliverKompoInfoOff() { return 'vlGetKomposerInfo'+this.$_elKompoId },

        $_pusherRefresh(){ return this.component.pusherRefresh },

    },
    methods:{
        $_deliverKompoInfoOn(){
            this.$_vlOn('vlGetKomposerInfo'+this.$_elKompoId, (askerId) => {

                this.$kompo.vlDeliverKompoInfo(askerId, this.$_kompoInfo)
                
            })
        },
        $_configureEcho(){

            if(!this.$_pusherRefresh)
                return

            Object.keys(this.$_pusherRefresh).forEach((key) => {

                this.$_pusherRefresh[key].forEach((message) => {

                    Echo.private(key).listen(message, (e) => {
                        
                        this.$_echoTrigger()

                    })

                })
            })
        },
        $_echoTrigger(){}, //to be overriden in Komposer
    },
}