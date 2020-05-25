import React, {useState, useEffect } from "react";

const Admin = (props) => {

    const [message, setMessage ] = useState("");

    useEffect(() => {
        fetch("/admin", {
            headers: {
                Authorization: `Bearer ${props.auth.getAccessToken()}`
            }
        }).then(response => {
        if (response.ok) return response.json();
        throw new Error("Network response was not ok.")
    }).then(response => setMessage(response.message)).catch(error => setMessage(error.message));
    });

return <div><p>{message}</p></div>
}

export default Admin;