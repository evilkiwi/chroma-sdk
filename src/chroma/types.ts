export interface App {
    title: string;
    description: string;
    author: {
        name: string;
        contact: string;
    };
    device_supported: string[];
    category: string;
}

export interface Options {
    domain?: string;
    port?: number;
}
