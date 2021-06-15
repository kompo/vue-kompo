import Action from './Action'
import Alert from './Alert'

export default class KompoAxios{

    constructor(element){

        this.element = element

        this.$_komponent = element instanceof Action ? element.vue : element
        this.$_parentKompoId = this.$_komponent.kompoid

        this.$_route = element.$_config('route')
        this.$_routeMethod = element.$_config('routeMethod')
        this.$_ajaxPayload = element.$_config('ajaxPayload')

        this.$_kompoAction = element.$_config('X-Kompo-Action')
        this.$_kompoTarget = element.$_config('X-Kompo-Target')

        this.$_kompoRoute = element.$_config('kompoRoute')
    
        this.$_ajaxOptionsMethod = element.$_config('ajaxOptionsMethod')

    }

    /****** Actions ******/ 
    $_actionAxiosRequest(payload, additionalPayload){

        var route = this.$_route
        var data = Object.assign(
            this.element.getPayloadFor('ajaxPayload'),
            payload,
            additionalPayload || {}
        )

        if(this.$_routeMethod == 'GET'){
            route = this.$_route+'?'+ new URLSearchParams(data).toString()
        }

        if(['POST', 'PUT', 'PATCH'].includes(this.$_routeMethod)){
            //Experimental - to test. Needed this because otherwise ...[0] names weren't converted to arrays in backend
            var formData = new FormData()
            for ( var key in data ) {
                if (_.isArray(data[key])){
                    data[key].forEach((item, k) => {
                        formData.append(key+'['+k+']', item)
                    })
                }else{
                    formData.append(key, data[key])
                }
            }
            data = formData
        }

        return this.$_axios({
            url: route, 
            method: this.$_routeMethod || 'POST', //POST when used outside PHP
            data: data,
            headers: Object.assign(
                {'X-Kompo-Info': this.$_getKompoInfo()}, 
                this.$_kompoAction ? { 'X-Kompo-Action': this.$_kompoAction } : {},
                this.$_kompoTarget ? { 'X-Kompo-Target': this.$_kompoTarget } : {}
            )
        })
    }
    $_submitFormAction(url, method, action, jsonFormData){
        return this.$_axios({
            url: url, 
            method: method,
            data: this.element.getFormData(jsonFormData),
            headers: Object.assign(
                {
                    'X-Kompo-Info': this.$_getKompoInfo()
                }, 
                action ? {
                    'X-Kompo-Action': action
                } : {},
                this.$_kompoTarget ? {
                    'X-Kompo-Target': this.$_kompoTarget,
                    'X-Kompo-Action': 'handle-submit' //X-Kompo-Action above will be overwritten if this.handle
                } : {}
            )
        })
    }

    /******* Komponents *********/
    $_browseQuery(page, sort){
        return this.$_axios({
            url: this.$_kompoRoute, 
            method: 'POST',
            data: this.$_komponent.preparedFormData(),
            headers: {
                'X-Kompo-Info': this.$_getKompoInfo(),
                'X-Kompo-Page': page,
                'X-Kompo-Sort': sort,
                'X-Kompo-Action': 'browse-items',
            }
        })
    }
    $_browseMany(url, specifications){
        return this.$_axios({
            url: url, 
            method: 'POST',
            data: specifications,
            headers: {
                'X-Kompo-Action': 'browse-many'
            }
        })
    }
    $_orderQuery(newOrder){
        return this.$_axiosWithErrorHandling({
            url: this.$_kompoRoute, 
            method: 'POST',
            data: {order: newOrder},
            headers: {
                'X-Kompo-Info': this.$_getKompoInfo(),
                'X-Kompo-Action': 'order-items'
            }
        })
    }
    $_selfPostQuery(payload){
        return this.$_axiosWithErrorHandling({
            url: this.$_kompoRoute, 
            method: 'POST',
            data: payload,
            headers: {
                'X-Kompo-Info': this.$_getKompoInfo(),
                'X-Kompo-Action': 'self-method',
                'X-Kompo-Target': this.$_kompoTarget,
            }
        })
    }
    $_loadKomposer(payload){

        return this.$_axiosWithErrorHandling({
            url: this.$_route, 
            method: this.$_routeMethod,
            data: Object.assign(this.$_ajaxPayload || {}, payload || {}),
            headers: {
                'X-Kompo-Info': this.$_getKompoInfo(),
                'X-Kompo-Action': 'load-komposer',
                'X-Kompo-Target': this.$_kompoTarget //komposerClass here
            }
        })
    }
    $_refreshSelf(url, payload){
        return this.$_axiosWithErrorHandling({
            url: url, 
            method: 'POST',
            data: payload,
            headers: {
                'X-Kompo-Info': this.$_getKompoInfo(),
                'X-Kompo-Action': 'refresh-self'
            }
        })
    }
    $_refreshMany(url, specifications){
        return this.$_axios({
            url: url, 
            method: 'POST',
            data: specifications,
            headers: {
                'X-Kompo-Action': 'refresh-many'
            }
        })
    }
    $_searchOptions(search){

        return this.$_axiosWithErrorHandling({
            url: this.$_kompoRoute, 
            method: 'POST',
            data: {
                search: search
            },
            headers: {
                'X-Kompo-Info': this.$_getKompoInfo(),
                'X-Kompo-Action': 'search-options',
                'X-Kompo-Target': this.$_ajaxOptionsMethod
            }
        })
    }

    /*** Internal *******/
    $_getKompoInfo(){

        var kompoInfo = this.$_komponent.$_kompoInfo //if a Komposer use own kompoInfo else fetch it

        if(!kompoInfo){
            this.$_komponent.$kompo.vlGetKomposerInfo(this.$_komponent.kompoid, this.$_komponent.$_elKompoId)
            kompoInfo = this.$_komponent.kompoInfo
        }

        return kompoInfo

    }
    $_axiosWithErrorHandling(axiosRequest){

        return this.$_axios(axiosRequest)
                   .catch(e => {

                        this.$_handleAjaxError(e) 

                    })
    }
    $_axios(axiosRequest){
        return axios(axiosRequest)
    }
    $_handleAjaxError(e){

        console.log(e)

        if(e.__CANCEL__) //to catch throw axios.Cancel
            return

        if(![419, 401].includes(e.response.status))
            return new Alert('Error '+e.response.status+' | '+e.response.data.message).asError().emitFrom(this.$_komponent)

        if(confirm(window._kompo.sessionTimeoutMessage))
            window.location.reload()
    }
}
