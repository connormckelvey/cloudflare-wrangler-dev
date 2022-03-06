import treeKill from 'tree-kill'
import * as ChildProcess from 'child_process'
import * as path from 'path'

export type WranglerDevOptions = {
    path?: string
    inspect?: boolean
    unauthenticated?: boolean
    verbose?: boolean
    config?: string
    env?: string
    host?: string
    ip?: string
    port?: number
    localProtocol?: any // TODO not sure what this is
    upstreamProtocol?: any // TOTO not sure what this is
    spawn?: ChildProcess.SpawnOptionsWithoutStdio
}

type FinalWranglerDevOptions = WranglerDevOptions & {
    path: string
}

const defaulOptions = {
    path: 'wrangler'
}

export class WranglerDev {
    public proc: ChildProcess.ChildProcessWithoutNullStreams
    private readonly opts: FinalWranglerDevOptions
    constructor(opts: WranglerDevOptions = defaulOptions) {
        this.opts = {
            ...opts,
            path: opts.path || defaulOptions.path
        }
        this.handleEarlyClose = this.handleEarlyClose.bind(this)
    }

    on(event: string, listener: (...args: any[]) => void) {
        this.proc.on(event, listener)
    }

    off(event: string, listener: (...args: any[]) => void) {
        this.proc.off(event, listener)
    }

    async start() {
        const args = [
            'dev',
            ...this.flags(),
            ...this.options(),
            ...this.args(),
        ]

        this.proc = ChildProcess.spawn(this.opts.path!, args, {
            ...this.opts.spawn,
        })

        this.proc.stderr.on('data', data => {
            console.log(data.toString())
        })


        this.on('close', this.handleEarlyClose)
        try {
            await this.waitFor()
        } catch (e) {
            console.log(e)
        }
        this.off('close', this.handleEarlyClose)
    }

    async stop() {
        return new Promise<void>((res, rej) => {
            treeKill(this.proc.pid!, (err) => {
                if (err) {
                    return rej(err)
                }
                res()
            })
        })
    }

    protected handleEarlyClose(...args: any[]) {
        const msg = `error starting wrangler: ${args.join(' ')}`
        console.log({ msg })
        throw new Error(msg)
    }

    protected async waitFor() {
        await new Promise<void>((res) => {
            this.proc.stdout.on('data', (data) => {
                console.log(data.toString())
                if (data.toString().includes('Listening on http')) {
                    res()
                }
            })
        })
    }

    protected rel(...pathParts: string[]) {
        const cwd = process.cwd()
        return path.join(cwd, ...pathParts)
    }

    protected flags() {
        return [
            this.opts.inspect && '--inspect',
            this.opts.unauthenticated && '--unauthenticated',
            this.opts.verbose && '--verbose'
        ].filter(v => !!v)
    }

    protected options() {
        return [
            this.opts.config && `--config ${this.rel(this.opts.config)}`,
            this.opts.env && `--env ${this.opts.env}`,
            this.opts.host && `--host ${this.opts.host}`,
            this.opts.ip && `--ip ${this.opts.ip}`,
            this.opts.port && `--port ${this.opts.port}`
        ].filter(v => !!v)
    }

    protected args() {
        return [
            this.opts.localProtocol,
            this.opts.upstreamProtocol,
        ].filter(v => !!v)
    }
}
