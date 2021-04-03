import HasVueComponent from './HasVueComponent'
import EmitsEvents from './EmitsEvents'
import HasId from './HasId'
import HasClasses from './HasClasses'
import HasStyles from './HasStyles'
import HasConfig from './HasConfig'
import RunsInteractions from './RunsInteractions'

export default {
    mixins: [ HasVueComponent, EmitsEvents, HasId, HasClasses, HasStyles, HasConfig, RunsInteractions],
    props: {
        vkompo: { type: Object, required: true },
        index: { type: Number },
    },
    data(){
        return{
            component: {},
            state: {},
            elementStore: {},
            parentKomposerInfo: {},
            label2: false,
        }
    },
	computed: {

        $_loading(){ return this.$_state('loading') },
        $_hasError(){ return this.$_state('hasError') },
        $_isSuccess(){ return this.$_state('isSuccess') },
        $_hidden(){ return this.$_state('vlHidden') },
        $_displayNone(){ return this.$_config('displayNone') },

        $_icon() { return this.$_config('icon') },
        $_rIcon() { return this.$_config('rIcon') },
        $_pureLabel() { return this.label2 ? this.$_label2 : this.component.label },
        $_label2() { return this.component.label2 },

        $_hasIcons(){ return this.$_icon || this.$_rIcon },

        $_label() { 
            return [this.$_icon, this.$_pureLabel, this.$_rIcon]
                    .filter(n => !_.isNil(n) && n !== '').join('&nbsp;')
        },

        $_defaultElementAttributes() {

            return Object.assign(
                this.$_config('attrs') || {},
                this.$_elementId() ? { id: this.$_elementId() } : {}
            )
        },
        
        $_toggleId(){ return this.$_config('toggleId') },
        $_toggleOnLoad(){ return this.$_config('toggleOnLoad') },

    },
    methods: {

        $_getFromStore(key){
            return key ? this.elementStore[key] : this.elementStore
        },
        $_state(state){
            if(_.isString(state)){
                return _.get(this.component, 'state.' + state)
            }else{
                this.state = Object.assign(this.state, state)
                this.component = Object.assign({}, this.component, { state: this.state })
            }
        },
        $_toggle(toggleId){
            if(this.$_elementId() == toggleId)
                this.$_toggleSelf()
        },
        $_toggleSelf(){
            this.$_state({ vlHidden: this.$_state('vlHidden') ? false : true })
        },
        $_deliverJsonTo(componentId, json){
            if(this.$_elKompoId == componentId)
                this.elementStore = json
        },
        //do nothing because fields/trigger functions
        $_fillRecursive(formData) {}, 
        $_validate(errors) {}, 
        $_getErrors(errors) {},
        $_resetSort(exceptId) {},
        $_attachEvents(){
            if(!this.$_elKompoId)
                return

            this.$_vlOn('vlDeliverKomposerInfo'+this.$_elKompoId, (senderId, komposerInfo) => { //for submit 

                this.parentKomposerInfo = Object.assign({}, this.parentKomposerInfo, {
                    [senderId] : komposerInfo
                })

            })
            this.$_vlOn('vlDeliverKompoInfo'+this.$_elKompoId, (kompoInfo) => { //for any axios request

                this.kompoInfo = kompoInfo

            })
        },
        $_destroyEvents(){
            this.$_vlOff([
                'vlDeliverKomposerInfo'+this.$_elKompoId,
                'vlDeliverKompoInfo'+this.$_elKompoId
            ])
        }
    },
    created(){
        this.vkompo.$_config = this.$_config
        this.vkompo.$_state = this.$_state
        this.vkompo.$_validate = this.$_validate
        this.vkompo.$_getErrors = this.$_getErrors
        this.vkompo.$_resetSort = this.$_resetSort
        this.vkompo.$_fillRecursive = this.$_fillRecursive
        this.vkompo.$_toggle = this.$_toggle
        this.vkompo.$_deliverJsonTo = this.$_deliverJsonTo
        this.component = this.vkompo

        this.$_destroyEvents()
        this.$_attachEvents()
    },
    updated() {
        this.$_destroyEvents()
        this.$_attachEvents()
    },
}