import { useState, useRef, useContext, createContext, PropsWithChildren } from "react";

interface ModalContext {
    openModal: (id: string, ...rest: any[]) => void;
    openModalAsync: (id: string, ...rest: any[]) => Promise<any>
    closeModal: (id: string) => void;
    setOpenCallback: (id: string, callback: AnyCallback) => void;
    openModals: string[];
}

interface FromModalContext {
    openModal: () => void;
    openModalAsync: () => Promise<any>;
    closeModal: () => void;
    setOpenCallback: (callback: AnyCallback) => void;
    isOpen: boolean
}

interface AsyncFromModalContext extends FromModalContext {
    resolve: (value: any) => void;
}

interface ModalCallbackMap {
    [id: string]: AnyCallback
}

const ModalContext = createContext({} as ModalContext);

export const useModal = () => useContext(ModalContext)

export const useFromModal = (id: string, openCallback?: AnyCallback): FromModalContext => {
    const modalContext = useContext(ModalContext);

    if(openCallback) {
        modalContext.setOpenCallback(id, openCallback);
    }

    return {
        openModal: (...params: any[]) => modalContext.openModal(id, ...params),
        openModalAsync: (...params: any[]) => modalContext.openModalAsync(id, ...params),
        closeModal: () => modalContext.closeModal(id),
        setOpenCallback: (callback: AnyCallback) => modalContext.setOpenCallback(id, callback),
        isOpen: modalContext.openModals.includes(id)
    }
}

export const useAsyncModal = (id: string, openCallback?: AnyCallback): AsyncFromModalContext => {
    const modalPromise = useRef<any>();
    const context = useFromModal(id);

    if(openCallback) {
        context.setOpenCallback((...params: any[]) => {
            openCallback(...params);
            return new Promise((resolve) => {
                modalPromise.current = resolve;
            });
        })
    }
    else {
        context.setOpenCallback(() => {
            return new Promise((resolve) => {
                modalPromise.current = resolve;
            });
        })
    }

    return {
        ...context,
        resolve: (value) => modalPromise.current(value)
    }
}

const ModalProvider = ({children}: PropsWithChildren) => {
    const [openModals, setOpenModals] = useState<string[]>([])
    const callbacks = useRef<ModalCallbackMap>({});

    const openModal = (id: string, ...rest: any[]) => {
        if(!openModals.find(m => m === id)) {
            if(callbacks.current[id]) {
                callbacks.current[id](...rest);
            }
            openModals.push(id);
            setOpenModals([...openModals]);
        }
    }

    const openModalAsync = async (id: string, ...rest: any[]) => {
        if(!openModals.find(m => m === id)) {
            openModals.push(id);
            setOpenModals([...openModals]);
            if(callbacks.current[id]) {
                return await callbacks.current[id](...rest);
            }
        }
    }

    const closeModal = (id: string) => {
        const index = openModals.findIndex(o => o === id);
        if(index > -1) {
            openModals.splice(index, 1);
            setOpenModals([...openModals]);
        }
    }

    const setOpenCallback = (id: string, callback: AnyCallback) => {
        callbacks.current[id] = callback;
    }

    return(
        <ModalContext.Provider value={{
            openModal,
            openModalAsync,
            closeModal,
            setOpenCallback,
            openModals
        }}>
            {children}
        </ModalContext.Provider>
    );
};

export default ModalProvider;