import {useCallback, useEffect, useState} from "react";

type TimerFunction = () => void;

const useTimer = (interval: number, state: boolean, func: () => void): TimerFunction => {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    
    const start = useCallback(() => {
        const timerId = setInterval(() => {
            func();
        }, interval);
        setTimer(timerId);
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
    }, [state]);// eslint-disable-line react-hooks/exhaustive-deps

    return terminate;
};
export default useTimer;