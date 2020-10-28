export default class TurboClick {
	constructor(vnode, url){

        this.vnode = vnode

        this.url = url


	}
    trigger(){
        axios.get(this.url).then(r => {
                            
            //parse the GET response HTML
            var doc = new DOMParser().parseFromString(r.data, "text/html")

            document.title = doc.title
            document.getElementsByTagName('body')[0].innerHTML= doc.getElementsByTagName('body')[0].innerHTML

            const getMainVueBootObject = function(vnode){
                const getMainVueOptionsRecursively = function (element){
                    return element.$parent ? 
                        getMainVueOptionsRecursively(element.$parent) : 
                        element.$options
                }
                const mainOpts = getMainVueOptionsRecursively(vnode.context)
                return Object.assign(
                    {el: mainOpts.el}, 
                    mainOpts.vuetify ? {vuetify: mainOpts.vuetify} : {}
                )
            }
            
            new Vue(getMainVueBootObject(this.vnode))

            //Re-run scripts with the class .reloadable-script
            //Kompo.events.$nextTick( () => { //nextTick not enough because of anonymous component in Panel {template: ...}
            setTimeout( () => { //TODO better solution
                Array.from(doc.getElementsByClassName('reloadable-script'))
                    .forEach((script) => { eval(script.innerHTML) })
            }, 400)

            //Change the browser's url and reload if back is pressed
            window.history.pushState({url: this.url}, "", this.url)
            window.onpopstate = function(e) {location.reload()} //for back button

        }).catch(e => {
            console.log('Error loading object in Panel:' + e)
        })
    }
}