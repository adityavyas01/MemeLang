export class ImprovedExecutor {
    constructor(debug = false) {
        this.variables = new Map();
        this.constants = new Set();
        this.functions = new Map();
        this.output = [];
        this.returnValue = undefined;
        this.breakLoop = false;
        this.continueLoop = false;
        this.debug = debug;
        // Add predefined constants
        this.variables.set('sahi_hai', true);
        this.constants.add('sahi_hai');
        this.variables.set('galat_hai', false);
        this.constants.add('galat_hai');
        this.variables.set('null_hai', null);
        this.constants.add('null_hai');
    }
}
