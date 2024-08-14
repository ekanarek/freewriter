import './AuthPage.css';
import Register from '../../components/Register.jsx';
import SignIn from '../../components/SignIn.jsx';

export default function AuthPage() {
    return (
        <div>
            <SignIn />
            <Register />
        </div>
    )
}