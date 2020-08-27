export default class Alert {
	constructor(message, icon, alertClass){

        this.message = message

        this.icon = icon

        this.alertClass = alertClass

	}
    asObject(alert){ //lazy... TODO: refactor
        this.message = alert.message

        this.icon = alert.icon

        this.alertClass = alert.alertClass
        return this
    }
    asError(){
        this.icon = '<i class="icon-attention"></i>'
        this.alertClass = 'vlAlertError'
        return this
    }
    emitFrom(emittor){
        emittor.$modal.events.$emit('showAlert', this)
    }
}