import { render, screen } from '@testing-library/react';
import App from './App';

test('renders top navigation brand title', () => {
  render(<App />);
  const title = screen.getByText(/Ocean Chatbot/i);
  expect(title).toBeInTheDocument();
});

test('renders initial assistant message', () => {
  render(<App />);
  const greeting = screen.getByText(/How can I help you today\?/i);
  expect(greeting).toBeInTheDocument();
});
