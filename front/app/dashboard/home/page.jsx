'use client';
import withAuth from "../../hooks/withAuth";
import Home from '../../components/home/Home';

function HomePage() {
    return <Home />;
}

export default withAuth(HomePage);