import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { GoogleSignOn } from '../auth/google-sign-on';
import './header-menu.scss';

export function HeaderMenu() {
    const [pageWidth, setPageWidth] = useState(window.innerWidth);

    useEffect(() => {
        const resizeListener = () => {
            setPageWidth(window.innerWidth);
        };
        window.addEventListener('resize', resizeListener);
        return () => {
            window.removeEventListener('resize', resizeListener);
        };
    }, []);

    let menuItems = (
        <div className="header-menu">
            <Link to="/recipes">My Recipe Book</Link>
            <Link to="/recipes/import">Import Recipe</Link>
            <Link to="/recipes/create">Create a Recipe</Link>
            <GoogleSignOn />
        </div>
    );

    if (pageWidth < 600) {
        menuItems = (
            <div className="header-menu">
                <Dropdown item floating pointing="right" icon="bars">
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            <Link to="/recipes">My Recipe Book</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link to="/recipes/import">Import Recipe</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link to="/recipes/create">Create a Recipe</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <GoogleSignOn />
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }

    return (
        <header>
            <div className="header-title">
                <h1>Recipe Book</h1>
            </div>
            {menuItems}
        </header>
    );
}
