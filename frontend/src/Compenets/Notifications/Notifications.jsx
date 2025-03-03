import {useEffect, useState } from "react";

const Notifications = () => {

    const [message, setMessage] = useState("");
    const VITE_WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

    useEffect(() => {
        const socket = new WebSocket(VITE_WEBSOCKET_URL);

        socket.onopen = () => {
            console.log("WebSocket Connected");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessage(data.message);
        };

        socket.onclose = () => {
            console.log("WebSocket Disconnected");
        };

        return () => socket.close();
    }, []);

    return (
        <div>
            <h2>Real-Time Notifications</h2>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Notifications;
