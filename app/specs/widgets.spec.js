describe("NavigationWidget", function() {
	var navigationWidget;
	var displayElement;
	
	beforeEach(function() {
		displayElement = $('<ul></ul>')
		navigationWidget = new NavigationWidget(displayElement);
	});
	
	describe("add", function() {
		it("should add navigation item to display element", function() {
			var itemName = "New Item";
			
			navigationWidget.add(itemName, function() {});
			
			expect(displayElement.html()).toContain(itemName);
		});
		
		it("should add callback for click on display element", function() {
			var navigationItemClickedCallback = jasmine.createSpy("navigation item clicked callbck");
			
			navigationWidget.add("New Item", navigationItemClickedCallback);
			displayElement.find('li.navigation-item').first().click();
			
			expect(navigationItemClickedCallback).toHaveBeenCalled();
		});
	});
});