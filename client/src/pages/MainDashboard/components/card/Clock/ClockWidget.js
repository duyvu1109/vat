import { useState } from 'react';
import './Clock.css';
import { Clock } from './components/Clock';

function ClockWidget() {
    const [message, setMessage] = useState(null);

    return (
        <>
            <Clock />
        </>
    );
}

export default ClockWidget;
