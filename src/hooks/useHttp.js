import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config) {
    const response = await fetch(url, config);

    const resData = await response.json()

    if (!response.ok) {
        throw new Error(
            resData.message || 'Something went wrong, failed to send request.'
        )
    }

    return resData;
}

export default function useHttp(url, config, initalData) {
    const [data, setData] = useState(initalData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    function clearData() {
        setData(initialData);
    }

    const sendRequest = useCallback(async function sendRequest(data) {
        setIsLoading(true)
        try {
            const resData = await sendHttpRequest(url, { ...config, body: data });
            setData(resData)
        } catch (error) {
            setError(error.message || 'Something went wrong!')
        }
        setIsLoading(false);
    }, [url, config])

    // if a function looks like will end in a loop then we'll have to wrap it with useCallback so that it should only be created when its dependency changes

    useEffect(() => {
        if (config && (config.method === 'GET' || !config.method) || !config) {
            // !config.method shows it will be undefined, !config means no config
            // this will run only afters when component will re-rendered, when page is getting reloads we are sending get request for every component
            sendRequest();
        }

    }, [sendRequest, config])

    return { data, isLoading, error, sendRequest, clearData }
}