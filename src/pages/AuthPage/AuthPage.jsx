import "./AuthPage.css";
import Register from "../../components/Register.jsx";
import SignIn from "../../components/SignIn.jsx";

export default function AuthPage() {
  return (
    <>
      <div className="auth-page">
        <h1>My Freewriter</h1>
        <div className="auth-copy">
          <p>
            Unlock your creativity with <i>My Freewriter</i>, a space designed
            for writers of all levels to warm up, explore ideas, and let
            inspiration flow freely. Each session begins with a random photo,
            sparking your imagination and guiding you into a freewriting
            exercise.
          </p>
          <p>
            Whether you're prepping for a larger project or just looking to
            stretch your creative muscles, <i>My Freewriter</i> is the perfect
            place to write without limits.
          </p>
          <p>
            Save your writing to your personal journal to revisit past
            exercises, and get ready to watch your creative journey unfold, one
            writing session at a time.
          </p>
          <p>
            <b>Register today</b> to start your freewriting adventure, or{" "}
            <b>sign in</b> to continue where you left off!
          </p>
        </div>
        <div className="auth-container">
          <Register />
          <SignIn />
        </div>
      </div>
    </>
  );
}
