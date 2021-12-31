import React from 'react';
import { css } from '@emotion/react';
import PacmanLoader from 'react-spinners/PacmanLoader';
import './async-loader.scss';

const override = css`
  border-color: red;
`;

interface IProps {
  loadingText?: string;
}

export default function AsyncLoader({ loadingText }: IProps) {
  return (
    <div className="async-loader">
      {loadingText && <p>{loadingText}</p>}
      <PacmanLoader css={override} color="#615b7f" loading={true} />
    </div>
  );
}
