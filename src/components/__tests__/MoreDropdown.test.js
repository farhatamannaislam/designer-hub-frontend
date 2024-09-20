import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MoreDropdown, ProfileEditDropdown } from '../MoreDropdown'; // Import the components


const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

test('renders correctly', () => {
    const handleEditMock = jest.fn();
    const handleDeleteMock = jest.fn();

    render(<MoreDropdown handleEdit={handleEditMock} handleDelete={handleDeleteMock} />);
    
    const dropdownButton = screen.getByText((content, element) => element.tagName.toLowerCase() === 'i');
    fireEvent.click(dropdownButton);
    

   
    expect(screen.getByLabelText('edit')).toBeInTheDocument();


    const editButton = screen.getByLabelText('edit');
    fireEvent.click(editButton);

   
    expect(handleEditMock).toHaveBeenCalled();
});

