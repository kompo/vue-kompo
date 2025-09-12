import Alert from './Alert'

/**
 * Global handler for Kompo dynamic responses
 * This can be used by any component to handle dynamic responses
 */
export default class KompoResponseHandler {
    /**
     * Handle a dynamic Kompo response
     * @param {Object} responseData - The response data containing kompoResponseType
     * @param {Object} vueInstance - The Vue component instance
     */
    static handle(responseData, vueInstance) {
        const { kompoResponseType, content, options = {} } = responseData

        switch (kompoResponseType) {
            case 'modal':
                vueInstance.$kompo.vlFillModal(
                    { data: content }, 
                    vueInstance.$_elKompoId || vueInstance.kompoid, 
                    {
                        confirmFunc: null,
                        warnBeforeClose: options.warnBeforeClose || false,
                        refreshParent: options.refreshParent || false,
                        closeAfterSubmit: options.closeAfterSubmit !== false,
                    }
                )
                break
                
            case 'panel':
                vueInstance.$kompo.vlFillPanel(responseData.panelId, content, {
                    included: options.included || null,
                    refreshParent: options.refreshParent || false,
                    resetAfterSubmit: options.resetAfterSubmit !== false,
                })
                break
                
            case 'drawer':
                vueInstance.$kompo.vlFillDrawer(
                    { data: content }, 
                    vueInstance.$_elKompoId || vueInstance.kompoid, 
                    {
                        warnBeforeClose: options.warnBeforeClose || false,
                        refreshParent: options.refreshParent || false,
                        closeAfterSubmit: options.closeAfterSubmit !== false,
                    }
                )
                break
                
            case 'popup':
                vueInstance.$kompo.vlFillPopup(
                    { data: content }, 
                    {
                        draggable: options.draggable || false,
                        resizable: options.resizable || false,
                    }
                )
                break
                
            case 'redirect':
                setTimeout(() => {
                    if (vueInstance.redirect) {
                        vueInstance.redirect(responseData.url)
                    } else {
                        window.location.href = responseData.url
                    }
                }, options.delay || 50)
                break
                
            case 'alert':
                new Alert().asObject({
                    message: responseData.message,
                    type: responseData.type || 'success',
                    ...options
                }).emitFrom(vueInstance)
                break
                
            case 'refresh':
                // For refresh, we need to trigger the parent component refresh
                if (vueInstance.$_destroyEvents) {
                    vueInstance.$_destroyEvents()
                }
                if (vueInstance.$_removeLiveKomponent) {
                    vueInstance.$_removeLiveKomponent()
                }
                if (vueInstance.$emit) {
                    vueInstance.$emit('refreshForm', responseData.data)
                }
                break
                
            default:
                console.warn('Unknown Kompo response type:', kompoResponseType)
        }
    }
}
