import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Avatar from '../Avatar';

describe('Avatar renders', () => {
  const renderComponent = (props) =>
    render(
      <Router>
        <Avatar {...props} />
      </Router>,
    );

    test('renders the avatar component with default image', () => {
        renderComponent();
      
        expect(screen.getByAltText('avatar')).toBeInTheDocument();
      });
      
      test('renders the avatar component with provided src', () => {
        const testSrc = 'https://example.com/test-avatar.jpg';
        renderComponent({ src: testSrc });
      
        expect(screen.getByAltText('avatar')).toHaveAttribute('src', testSrc);
      });
});
