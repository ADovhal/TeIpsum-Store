import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MannequinViewer from './MannequinViewer';

// Mock iframe
global.HTMLIFrameElement = class HTMLIFrameElement {};

describe('MannequinViewer', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Синяя футболка',
      type: 'shirt',
      color: '#3498db',
      price: 1500,
    },
    {
      id: '2',
      name: 'Черные брюки',
      type: 'pants',
      color: '#2c3e50',
      price: 2500,
    },
  ];

  const defaultBodyParams = {
    height: 175,
    chest: 100,
    waist: 85,
    hips: 95,
    shoulderWidth: 45,
  };

  it('renders correctly with default props', () => {
    render(<MannequinViewer />);
    
    expect(screen.getByText('Параметры тела')).toBeInTheDocument();
    expect(screen.getByText('Выбранные продукты')).toBeInTheDocument();
  });

  it('displays body parameters inputs with correct values', () => {
    render(<MannequinViewer initialBodyParams={defaultBodyParams} />);
    
    const heightInput = screen.getByLabelText('Рост (см)');
    expect(heightInput).toHaveValue(175);
    
    const chestInput = screen.getByLabelText('Обхват груди (см)');
    expect(chestInput).toHaveValue(100);
  });

  it('updates body parameters when input changes', () => {
    render(<MannequinViewer initialBodyParams={defaultBodyParams} />);
    
    const heightInput = screen.getByLabelText('Рост (см)');
    fireEvent.change(heightInput, { target: { value: '180' } });
    
    expect(heightInput).toHaveValue(180);
  });

  it('displays available products', () => {
    render(<MannequinViewer availableProducts={mockProducts} />);
    
    expect(screen.getByText('Синяя футболка')).toBeInTheDocument();
    expect(screen.getByText('Черные брюки')).toBeInTheDocument();
    expect(screen.getByText('Доступные продукты')).toBeInTheDocument();
  });

  it('adds product when clicked', () => {
    const onProductsChange = jest.fn();
    render(
      <MannequinViewer
        availableProducts={mockProducts}
        onProductsChange={onProductsChange}
      />
    );
    
    const productCard = screen.getByText('Синяя футболка').closest('div');
    fireEvent.click(productCard);
    
    expect(screen.getByText('Удалить')).toBeInTheDocument();
    expect(onProductsChange).toHaveBeenCalled();
  });

  it('removes product when remove button is clicked', () => {
    const initialProducts = [mockProducts[0]];
    render(
      <MannequinViewer
        availableProducts={mockProducts}
        initialSelectedProducts={initialProducts}
      />
    );
    
    const removeButton = screen.getByText('Удалить');
    fireEvent.click(removeButton);
    
    expect(screen.queryByText('Синяя футболка')).not.toBeInTheDocument();
  });

  it('shows empty state when no products selected', () => {
    render(<MannequinViewer />);
    
    expect(
      screen.getByText(/Выберите продукты из списка ниже/)
    ).toBeInTheDocument();
  });

  it('generates correct iframe URL with body params', () => {
    render(<MannequinViewer initialBodyParams={defaultBodyParams} />);
    
    const iframe = screen.getByTitle('3D Mannequin Viewer');
    expect(iframe).toHaveAttribute('src');
    
    const src = iframe.getAttribute('src');
    expect(src).toContain('height=175');
    expect(src).toContain('chest=100');
  });
});

