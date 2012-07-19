var fileSystem = require('fs');
var path = require('path');

this.insertAfterHead = function(htmlFilePath, templatesDir) {
	var htmlTagToInsertAfter = "<head>";
	var htmlFile = fileSystem.readFileSync(htmlFilePath);
	return htmlFile.toString('utf8').replace(htmlTagToInsertAfter, htmlTagToInsertAfter + this.gatherAllTemplatesContents(templatesDir));
}
this.gatherAllTemplatesContents = function(templatesDir) {
	var templateFileNames = fileSystem.readdirSync(templatesDir);
	var templateContents = "";
	for(var i = 0; i < templateFileNames.length; i++) {
		var templateFilePath = path.join(templatesDir, templateFileNames[i]);
		templateContents += fileSystem.readFileSync(templateFilePath);
	}
	return templateContents;
}