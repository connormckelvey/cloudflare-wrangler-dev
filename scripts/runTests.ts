import * as testing from 'start-testing'
import { NodeColorLogger } from 'start-testing/dist/extra/nodeLogger.js'
import * as wranglerDevTests from '../src/wranglerDev.test.js'

const tests = {
    ...wranglerDevTests
}

async function runTests() {
    testing.Runner.runSuite('tests', tests, { logger: new NodeColorLogger() })
        .then(process.exit)
}

runTests()