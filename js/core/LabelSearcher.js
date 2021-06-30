export default class LabelSearcher{
	constructor(){

	}
    makeBestGuessForLabel(object){
        if (!object) {
            return ''
        }

        let objectLabel = object.label

        if (objectLabel) {
            if (_.isString(objectLabel)) {
                return objectLabel
            }

            if (_.isObject(objectLabel)){
                let objChildren = objectLabel.komponents
                if (objChildren && objChildren.length && objChildren[0].label && _.isString(objChildren[0].label)){
                    return objChildren[0].label
                }

                if (objectLabel.label) {
                    return objectLabel.label
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