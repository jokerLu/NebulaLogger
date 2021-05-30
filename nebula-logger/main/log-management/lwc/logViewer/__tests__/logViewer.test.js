import { createElement } from 'lwc';
import LogViewer from 'c/logViewer';
import getLog from '@salesforce/apex/Logger.getLog';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

// Mock data
const mockGetLog = require('./data/getLog.json');

// Register a test wire adapter
const getLogAdapter = registerApexTestWireAdapter(getLog);

function assertForTestConditions() {
    const resolvedPromise = Promise.resolve();
    return resolvedPromise.then.apply(resolvedPromise, arguments);
}

function flushPromises() {
    return new Promise(resolve => setTimeout(resolve, 0));
}

jest.mock(
    '@salesforce/apex/Logger.getLog',
    () => {
        return {
            default: () => mockGetLog
        };
    },
    { virtual: true }
);

describe('Logger JSON Viewer lwc tests', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });
    it('sets document title', async () => {
        const logViewerElement = createElement('c-log-viewer', { is: LogViewer });
        document.body.appendChild(logViewerElement);
        getLogAdapter.emit(mockGetLog);

        // Resolve a promise to wait for a rerender of the new content
        return assertForTestConditions(() => {
            expect(logViewerElement.title).toEqual('JSON for ' + mockGetLog.Name);
        });
    });
    it('defaults to brand button variant', async () => {
        const logViewer = createElement('c-log-viewer', { is: LogViewer });
        document.body.appendChild(logViewer);

        getLogAdapter.emit(mockGetLog);

        // Resolve a promise to wait for a rerender of the new content
        return assertForTestConditions(() => {
            const inputButton = logViewer.shadowRoot.querySelector('lightning-button-stateful');
            expect(logViewer.title).toEqual('JSON for ' + mockGetLog.Name); // this works (TODO remove this)
            expect(logViewer.variant).toEqual('brand'); // this fails due to undefined (TODO remove this)
        });
    });
});