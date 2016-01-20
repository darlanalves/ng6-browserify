import { di } from 'angular-di';
import template from './<%= name %>.html';

class <%= className %> {
    static configure() {
        // istanbul ignore next
        return {
            template,
            selector: '<%= name %>',
        };
    }

    constructor() {
        //
    }
}

export { <%= className %> };
