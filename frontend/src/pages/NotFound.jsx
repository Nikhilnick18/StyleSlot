import {Link} from "react-router-dom";

function NotFound() {
    return (
        <main className="auth-page">
             <div className="auth-card">
                <Link to="/" className="auth-brand">
                style<span>slot.</span>
                </Link>

                <p className="auth-eyebrow">PAGE NOT FOUND</p>
                <h1>Lost your way?</h1>

                <p className="auth-description">
                    Looks like this page doesn't exist.Let's get you back to discovering your next great look. 
                </p>

                <Link to="/" className="details-book-button">
                          Back to homepage ↗
                    </Link>
             </div>
        </main>
    );
}

export default NotFound;