import { useEffect } from 'react';
import { useRouter } from 'next/router';

function Index() {
    const router = useRouter();

    useEffect(() => {
        // upon page loading, redirect straight to login
        router.push('/login');
    }, [router]);

    // right now, returns nothing to "actual" homepage
    // should probably put SOMETHING here, but for now login is the starter page
    return null;
}

export default Index;