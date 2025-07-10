import { render, screen, waitFor } from '@testing-library/react';

/**
 * Testing the home page /
 */
describe('HomePage', () => {
  it('should load the home page', async () => {
    const HomePage = require('./page').default;

    render(<HomePage />);
    await waitFor(() => {
      const homepage = screen.getByText('homepage', { exact: false });
      expect(homepage).toBeInTheDocument();
    });
  });
});
