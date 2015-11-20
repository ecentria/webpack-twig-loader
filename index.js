var utils = require("loader-utils"),

    twig = require('twig').twig;

module.exports = function(content) {

    var id = this.resource,
        matches,
        tpl;

    if (!id) {
        throw new Error('File name is empty.');
    }

    matches = id.match(/([^/\?#]+).*$/);

    if (matches === null) {
        throw new Error('File name not found in "' + id + '"');
    }

    id = matches.length ? matches[1] : id;
    twig({ id: id, data: content }).compile({ module: 'node' });

    return 'module.exports = ' + tpl.match(/(?:twig\()(.*)(?:\))/m)[1] + ';';
}
