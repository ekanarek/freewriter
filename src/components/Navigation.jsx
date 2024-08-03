import { Link } from 'react-router-dom';

export default function Navigation() {
    return (
        <nav>
            <Link to="/">New Freewrite</Link>
            <Link to="/journal">My Journal</Link>
            <Link to="/auth">Sign In/Create an Account</Link>
        </nav>
    )
}