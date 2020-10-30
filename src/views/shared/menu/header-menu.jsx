import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
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
            <Link to="/recipes/community">Community Recipes</Link>
        </div>
    );

    if (pageWidth < 600) {
        menuItems = (
            <div className="header-menu mobile">
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
                            <Link to="/recipes/community">Community Recipes</Link>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }

    return (
        <header>
            <div className="header-title">
                <h1>
                    <Link to="/">Recipe Book</Link>
                </h1>
            </div>
            {menuItems}
        </header>
    );
}
