/* eslint-disable no-var */
interface ElectronInterop {
    send: (msg: string, data?: any) => void;
    receive: (channel: string, func: (data: any) => void) => void;
    invoke: (msg: string, data?: any) => Promise<any>;
    removeAllListeners: () => void;
    removeListener: (channel: string, listener: (...args: any[]) => void) => void
}

declare global {
    var interop: ElectronInterop;
}

export {};