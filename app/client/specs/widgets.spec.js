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

describe("StatusWidget", function() {
	var statusWidget;
	var displayElement;
	
	beforeEach(function() {
		displayElement = $('<div></div>');
		statusWidget = new StatusWidget(displayElement);
	});
	
	describe("display", function() {
		it("should display the success message", function() {
			var status = "A success occured!";
			
			statusWidget.displaySuccess(status);
			
			expect(displayElement.html()).toContain(status);
			expect(displayElement.find('.success-message')).toExist();
		});
		
		it("should display the standard message", function() {
			var status = "An event completed!";
			
			statusWidget.displayMessage(status);
			
			expect(displayElement.html()).toContain(status);
			expect(displayElement.find('.standard-message')).toExist();
		});
		
		it("should display the error message", function() {
			var status = "An error occured!";
			
			statusWidget.displayError(status);
			
			expect(displayElement.html()).toContain(status);
			expect(displayElement.find('.error-message')).toExist();
		});
	});
});