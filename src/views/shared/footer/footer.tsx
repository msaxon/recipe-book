import React from 'react';
import { Link } from 'react-router-dom';
import './footer.scss';

export default function Footer() {
    return (
        <footer>
            <div className="footer-menu">
                <Link to="/privacy">Privacy</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/about">About</Link>
            </div>
        </footer>
    );
}
