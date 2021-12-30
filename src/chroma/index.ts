import type { EffectObject } from '@/effects';
import { Device } from '@/enums';
import type { App, Options } from './types';

export class ChromaSDK {
    app: App;
    options: Options;
    url: string;
    connected = false;
    uri: string|null = null;
    sessionId: number|null = null;

    constructor(app: App, options: Options = {}) {
        this.app = app;
        this.options = {
            domain: 'chromasdk.io',
            port: 54236,
            ...options,
        };
        this.url = `https://${this.options.domain}:${this.options.port}/razer/chromasdk`;
    }

    async useEffect<E = {}>(device: Device, effect: EffectObject<E>) {
        if (!this.connected) {
            throw new Error('Must be connected');
        }

        let body: any = {};

        if (Array.isArray(effect)) {
            //
        } else {
            body = effect;
        }

        const data = await this.req('PUT', `${this.uri}/${device}`, body);

        if (data.result !== 0) {
            throw new Error(`Effect failed with result ${data.result}`);
        }

        return data.id;
    }

    async connect() {
        try {
            const data = await this.req('POST', this.url, this.app);

            if (!data.sessionid || !data.uri) {
                throw new Error('Invalid Chroma response');
            }

            this.uri = data.uri;
            this.sessionId = data.sessionid;
            this.connected = true;

            setTimeout(() => this.ping(), 5000);
        } catch {
            throw new Error('Could not connect');
        }
    }

    async ping() {
        if (!this.connected) {
            return;
        }

        await this.req('PUT', `${this.uri}/heartbeat`);

        setTimeout(() => this.ping(), 5000);
    }

    async stop() {
        try {
            await this.req('DELETE', `${this.uri}/heartbeat`);
        } catch {
            // Do nothing.
        }

        this.uri = null;
        this.sessionId = null;
        this.connected = false;
    }

    async req(method: string, url: string, body: any = null) {
        const req: RequestInit = {
            method,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (body !== null) {
            req.body = JSON.stringify(body);
        }

        const response = await fetch(url, req);

        return await response.json();
    }
}
