import path from 'path'
import * as testing from 'start-testing'
import { WranglerDev } from './wranglerDev.js'
import fetch from 'node-fetch'
import { chaiAssert } from 'start-testing/dist/extra/testUtils.js'

export async function testWranglerDev(t: testing.Context) {
    const assert = chaiAssert(t)
    const wrangler = new WranglerDev({
        spawn: {
            cwd: path.join(process.cwd(), 'test')
        }
    })
    
    await wrangler.start()
    let res = await fetch('http://127.0.0.1:8787')
    assert.equal(res.status, 200)
    assert.equal(await res.text(), 'hello world')
    await wrangler.stop()

    // run 2x to test wrangler.stop()
    await wrangler.start()
    res = await fetch('http://127.0.0.1:8787')
    assert.equal(res.status, 200)
    assert.equal(await res.text(), 'hello world')
    await wrangler.stop()
}