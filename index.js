var utils = require("loader-utils"),

	twig = require('twig').twig;

module.exports = function(content) {

	var id = this.resource,
	    matches = id.match(/([^/]+$)/);
	    
        id = matches.length ? matches[0] : id;

	var tpl = twig({ id: id, data: content })
		.compile({ module: 'node' });

	return 'module.exports = ' + tpl.match(/(?:twig\()(.*)(?:\))/m)[1] + ';';

}
