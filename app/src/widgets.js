var NavigationWidget = function(displayElement) {
	this.displayElement = displayElement;
}
NavigationWidget.prototype.add = function(itemName, itemCallback) {
	var template = Handlebars.compile($('#navigation-widget-item').html());
	var editHtml = $(template({ name: itemName}));
	editHtml.click(function() {
		itemCallback();
	}).appendTo(this.displayElement);
}