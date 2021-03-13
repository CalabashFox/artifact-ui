import {useCallback, useEffect, useState} from "react";

const useTimer = (interval: number, state: boolean, func: () => void): void => {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    
    const start = useCallback(() => {
        setTimer(setInterval(() => {
            func();
        }, interval));
    }, [interval, func]);

    const terminate = useCallback(() => {
        if (timer !== null) {
            clearInterval(timer);
        }
    }, [timer]);

    useEffect(() => {
        if (state) {
            start();
        } else {
            terminate();
        }
        return () => {
            terminate();
        };
    }, [state, interval, start, terminate]);
};
export default useTimer;