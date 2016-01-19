import { di } from 'angular-di';

class <%= className %> {
    static configure() {
        // istanbul ignore next
        return {
            selector: '<%= name %>',
            templateUrl: '<%= name %>/<%= name %>.html'
        };
    }

    constructor() {
        //
    }
}

export { <%= className %> };
