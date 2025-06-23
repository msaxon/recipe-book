import PacmanLoader from 'react-spinners/PacmanLoader';

import './async-loader.scss';

interface IProps {
  loadingText?: string;
}

export default function AsyncLoader({ loadingText }: IProps) {
  return (
    <div className="async-loader">
      {loadingText && <p>{loadingText}</p>}
      <PacmanLoader color="#615b7f" loading={true} />
    </div>
  );
}
