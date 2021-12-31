import React from 'react';
import { css } from '@emotion/react';
import PacmanLoader from 'react-spinners/PacmanLoader';
import './async-loader.scss';

const override = css`
    border-color: red;
`;

export default function AsyncLoader() {
    return (
        <div className="async-loader">
            <p>Importing Recipe</p>
            <PacmanLoader css={override} color="#615b7f" loading={true} />
        </div>
    );
}
