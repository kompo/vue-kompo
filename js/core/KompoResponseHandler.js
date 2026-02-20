import Alert from './Alert'
import { buildJsCtx } from './KompoHelper'

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
                const kompoids = responseData.kompoids
                const refreshData = responseData.data

                if (kompoids) {
                    // Target specific component(s)
                    const ids = Array.isArray(kompoids) ? kompoids : [kompoids]
                    ids.forEach(kompoid => {
                        vueInstance.$kompo.vlReloadAfterChildAction(kompoid, refreshData)
                    })
                } else {
                    // Self-refresh: trigger refresh on the component that made the request
                    const selfKompoid = vueInstance.kompoid || vueInstance.$_elKompoId
                    if (selfKompoid) {
                        vueInstance.$kompo.vlReloadAfterChildAction(selfKompoid, refreshData)
                    }
                }
                break

            case 'updateElements':
                const targetKompoid = responseData.kompoid || vueInstance.kompoid || vueInstance.$_elKompoId
                if (targetKompoid) {
                    vueInstance.$kompo.vlUpdateElements(targetKompoid, responseData.elements, responseData.transition)
                }
                break

            case 'updateElementValues':
                // Update elements globally by their IDs (targets elements directly, not komponent arrays)
                const updates = responseData.updates || {}
                Object.keys(updates).forEach(elementId => {
                    vueInstance.$kompo.vlUpdateElement(elementId, updates[elementId])
                })
                break

            case 'addToQuery':
                vueInstance.$kompo.vlAddItem(
                    responseData.queryId,
                    responseData.element,
                    responseData.position
                )
                break

            case 'prependToQuery':
                vueInstance.$kompo.vlPrependItem(
                    responseData.queryId,
                    responseData.element
                )
                break

            case 'removeFromQuery':
                vueInstance.$kompo.vlRemoveItemById(
                    responseData.queryId,
                    responseData.itemId
                )
                break

            case 'updateInQuery':
                vueInstance.$kompo.vlUpdateItem(
                    responseData.queryId,
                    responseData.itemId,
                    responseData.element
                )
                break

            case 'run':
                const jsFunction = responseData.jsFunction
                const runData = responseData.data

                vueInstance.$nextTick(() => {
                    if (!jsFunction) {
                        return
                    }

                    // Build context object with response data and vue instance info
                    const ctx = {
                        data: runData,
                        response: runData,
                        el: vueInstance,
                        $el: vueInstance.$el,
                        kompoid: vueInstance.kompoid || vueInstance.$_elKompoId,
                        $kompo: vueInstance.$kompo,
                        ...buildJsCtx(vueInstance, runData),
                    }

                    // Detect arrow functions: () =>, (x) =>, (a, b) =>, x =>
                    const isArrowFunction = /^\s*(\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/.test(jsFunction)

                    if (isArrowFunction) {
                        try {
                            let toExecute = eval(jsFunction)
                            toExecute(ctx)
                        } catch (e) {
                            console.error('Kompo kompoRun() error:', e, 'Function:', jsFunction)
                        }
                        return
                    }

                    // Handle named functions on window
                    if (window[jsFunction]) {
                        window[jsFunction](ctx)
                    }

                    // Vue component method
                    if (vueInstance[jsFunction]) {
                        vueInstance[jsFunction](ctx)
                    }
                })
                break

            case 'multi':
                // Execute multiple response actions sequentially
                const actions = responseData.actions || []
                actions.forEach(action => {
                    KompoResponseHandler.handle(action, vueInstance)
                })
                break

            default:
                console.warn('Unknown Kompo response type:', kompoResponseType)
        }
    }
}
