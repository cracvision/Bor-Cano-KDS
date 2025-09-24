
import { useState, useEffect } from 'react';

const useElapsedTime = (startTime: string): string => {
    const [elapsedTime, setElapsedTime] = useState('');

    useEffect(() => {
        const updateTimer = () => {
            const start = new Date(startTime).getTime();
            const now = new Date().getTime();
            const difference = Math.floor((now - start) / 1000);

            if (difference < 0) {
                setElapsedTime('00:00');
                return;
            }

            const minutes = Math.floor(difference / 60);
            const seconds = difference % 60;

            setElapsedTime(
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            );
        };
        
        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);

        return () => clearInterval(intervalId);
    }, [startTime]);

    return elapsedTime;
};

export default useElapsedTime;
