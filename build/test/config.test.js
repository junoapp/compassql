"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const config_1 = require("../src/config");
describe('config', () => {
    describe('extendConfig', () => {
        const extendedOpt = config_1.extendConfig({
            verbose: true,
            enum: {
                mark: ['point'],
                binProps: {
                    maxbins: [100, 200]
                }
            }
        });
        it('should preserve default config for ones not overridden.', () => {
            chai_1.assert.equal(extendedOpt.autoAddCount, config_1.DEFAULT_QUERY_CONFIG.autoAddCount);
        });
        it('should successfully override top-level config without changing the default', () => {
            chai_1.assert.equal(extendedOpt.verbose, true);
            chai_1.assert.notEqual(extendedOpt.verbose, config_1.DEFAULT_QUERY_CONFIG.verbose);
        });
        it('should successfully override top-level enum config without changing the default', () => {
            chai_1.assert.deepEqual(extendedOpt.enum.mark, ['point']);
            chai_1.assert.notDeepEqual(extendedOpt.enum.mark, config_1.DEFAULT_QUERY_CONFIG.enum.mark);
        });
        it('should successfully override nested enum config without changing the default', () => {
            chai_1.assert.deepEqual(extendedOpt.enum.binProps.maxbins, [100, 200]);
            chai_1.assert.notDeepEqual(extendedOpt.enum.binProps.maxbins, config_1.DEFAULT_QUERY_CONFIG.enum.binProps.maxbins);
        });
    });
});
//# sourceMappingURL=config.test.js.map