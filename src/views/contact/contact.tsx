import { usePageTitle } from '../../hooks/usePageTitle.ts';

export default function Contact() {
  usePageTitle('Contact');
  return (
    <div>
      <h2>Contact</h2>
      <p>
        Report issues and enhancement ideas at{' '}
        <a href="https://github.com/msaxon/recipe-book/issues">
          the github project
        </a>
      </p>
    </div>
  );
}
