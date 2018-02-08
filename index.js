var Twig = require('twig');

module.exports = function(content) {
    var id = this.resource, matches, template, compile = false, compiled, query, isCacheEnabled = false;

    this.cacheable();

    if (!id) {
        throw new Error('File name cannot be empty.');
    }

    matches = id.match(/([^\/]+$)/);

    if (matches === null) {
        throw new Error('File name is not valid "' + id + '"');
    }

    id = matches.length ? matches[1] : id;

    if (this.query) {
        // in webpack v2, this.query comes in the following format: { enablecache: false }
        if (typeof(this.query.enablecache) === 'boolean') {
            isCacheEnabled = this.query.enablecache;
        } else if (typeof(this.query) === 'string') {
            // in webpack v1, this.query comes in the following format: ?{"enablecache":false}
            query = JSON.parse(this.query.slice(1));
            isCacheEnabled = query.enablecache;
        }
    }

    // Checking for cached template
    template = Twig.twig({ ref: id, rethrow: true });
    if (template === null) {
        compile = true;
        template = Twig.twig({ id: id, data: content, rethrow: true, strict_variables: true });
    }

    // Removing the template from cache
    if (!isCacheEnabled) {
        Twig.extend(function(Twig) {
            delete Twig.Templates.registry[id];
        });
    }

    if (compile) {
        compiled = template.compile({ module: 'node' });
        compiled = compiled.match(/(?:twig\()(.*)(?:\))/m)[1] + ';';
    } else {
        compiled = '{}';
    }

    return 'module.exports = ' + compiled;
};
