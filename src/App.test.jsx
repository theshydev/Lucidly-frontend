import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
    document.documentElement.className = '';
  });

  it('renders the home page by default', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Your Journey/i })).toBeInTheDocument();
    expect(screen.getByText('Lucidly Features')).toBeInTheDocument();
  });

  it('navigates to journaling page from home CTA and saves a journal entry', () => {
    render(<App />);

    fireEvent.click(screen.getAllByText('Get Started')[0]);
    expect(screen.getByRole('heading', { name: 'Journaling' })).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText("What's on your mind today?");
    fireEvent.change(textarea, { target: { value: 'Today felt productive.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Journal Entry' }));

    expect(localStorage.getItem('lucidly_journal_entry')).toBe('Today felt productive.');
    expect(screen.getByText('Journal entry saved!')).toBeInTheDocument();
  });

  it('toggles dark mode classes on body and root element', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /dark mode toggle/i }));

    expect(document.body).toHaveClass('bg-gray-900', 'text-gray-100');
    expect(document.documentElement).toHaveClass('dark');

    fireEvent.click(screen.getByRole('button', { name: /dark mode toggle/i }));

    expect(document.body).not.toHaveClass('bg-gray-900');
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('scrolls to sections when navbar links are clicked', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<App />);

    const featuresSection = document.getElementById('features');
    featuresSection.scrollIntoView = vi.fn();

    fireEvent.click(screen.getByText('Features'));
    expect(featuresSection.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    fireEvent.click(screen.getByText('Home'));
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

    scrollToSpy.mockRestore();
  });

  it('shows AI check-in results after submitting form values', () => {
    render(<App />);

    fireEvent.click(screen.getByText('AI Check-In'));

    fireEvent.change(screen.getByPlaceholderText('e.g., bad'), { target: { value: 'anxious' } });
    fireEvent.change(screen.getByPlaceholderText('e.g., low'), { target: { value: 'low' } });
    fireEvent.change(screen.getByPlaceholderText('e.g., no'), { target: { value: 'work' } });

    fireEvent.click(screen.getByRole('button', { name: 'Check' }));

    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument();
    expect(screen.getByText('Stress Score')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
  });
});
