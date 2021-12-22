export default class LabelSearcher{
	constructor(){

	}
    makeBestGuessForLabel(object){
        if (!object) {
            return ''
        }

        let oLabel = object.label

        if (oLabel) {
            if (_.isString(oLabel)) {
                return oLabel
            }

            if (_.isObject(oLabel)){
                if (oLabel.$_config('searchableBy')) {
                    return oLabel.$_config('searchableBy')
                }

                let children = oLabel.elements
                if (children && children.length) {
                    if(children[0].label && _.isString(children[0].label)){
                        return children[0].label
                    }
                }

                if (oLabel.label) {
                    return oLabel.label
                }
            }
        }

        return ''
    }
    filterOptions(options, search){
        //https://stackoverflow.com/questions/5700636/using-javascript-to-perform-text-matches-with-without-accented-characters
        return _.filter(options, (opt) => {
            let searchable = this.normalizeStr(this.makeBestGuessForLabel(opt))
            return searchable.indexOf(this.normalizeStr(search)) !== -1
        })
    }
    normalizeStr(str){
        return str.toString().normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g, "")
    }
}