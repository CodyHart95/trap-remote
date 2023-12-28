import { useEffect } from "react";

const eventHandlers: {
    [key: string]: eventHandler[]
} = {};

type eventHandler = (...params: any[]) => Promise<void>;

export const subscribe = (eventName: string, handler: eventHandler) => {
    if(!eventHandlers[eventName]){
        eventHandlers[eventName] = []
    }

    eventHandlers[eventName].push(handler);
};

export const emit = (eventName: string, ...rest: any[]) => {
    if(eventHandlers[eventName].length) {
        for(const event of eventHandlers[eventName]) {
            event(...rest);
        }
    }
}

export const unsubscribe = (eventName: string , handler: eventHandler) => {
    if(eventHandlers[eventName].length) {
        const handlerIndex = eventHandlers[eventName].findIndex(handler);
        eventHandlers[eventName].splice(handlerIndex, 1);
    }
}

export const useSubscribe = (eventName: string, handler: eventHandler) => {
    useEffect(() => {
        subscribe(eventName, handler);

        return () => unsubscribe(eventName, handler);
    }, []);
}