import { createRequest } from '@api/Base.api';
import { LoaderCircle } from '@components/LoaderCircle';
import { API } from '@constants/api.constant';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const RedirectPage = () => {
    const [visible, setVisible] = useState(false);
    const [searchParams] = useSearchParams();


    useEffect(() => {
        const code = searchParams.get('code');
        if(code) {
            setVisible(true);
            createRequest(`${API.GOOLE_AUTH.CALLBACK}?code=${code}`, 'POST', {})
                .then((res) => {
                    setVisible(false);
                    window?.opener?.postMessage(JSON.stringify(res), "*");
                    window.close();
                })
                .catch((err) => {
                    setVisible(false);
                    window.close();
                });
        }
    }, [searchParams.get('code')]);
    return (
        <div className="relative min-h-screen">
            <LoaderCircle visible={visible} />
        </div>
    );
};
