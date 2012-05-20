var NavigationWidget = function(displayElement) {
	this.displayElement = displayElement;
}
NavigationWidget.prototype.add = function(itemName, itemCallback, templateName) {
	var chosenTemplateName = templateName || '#navigation-widget-item';
	var template = Handlebars.compile($(chosenTemplateName).html());
	var navigationItemElement = $(template({ name: itemName}));
	navigationItemElement.click(function() {
		itemCallback();
	}).appendTo(this.displayElement);
}

var StatusWidget = function(displayElement) {
	this.displayElement = displayElement;
}
StatusWidget.prototype.display = function(statusMessage, templateId) {
	var template = Handlebars.compile($(templateId).html());
	var messageElement = $(template({ message: statusMessage }));
	this.displayElement.append(messageElement);
	var childrenCount = this.displayElement.children().length;
	setTimeout(function() {
		messageElement.fadeOut(1000);
	}, 1000 * childrenCount);
}
StatusWidget.prototype.displaySuccess = function(statusMessage) {
	this.display(statusMessage, '#status-widget-message-success');
}
StatusWidget.prototype.displayMessage = function(statusMessage) {
	this.display(statusMessage, '#status-widget-message-standard');
}
StatusWidget.prototype.displayError = function(statusMessage) {
	this.display(statusMessage, '#status-widget-message-error');
}

