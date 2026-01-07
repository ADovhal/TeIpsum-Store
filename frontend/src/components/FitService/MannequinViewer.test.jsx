import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MannequinViewer from './MannequinViewer';

// Mock ThreeMannequinCanvas since it requires WebGL
jest.mock('./ThreeMannequinCanvas', () => {
  return function MockThreeMannequinCanvas({ bodyParams, products }) {
    return (
      <div data-testid="three-canvas">
        <span data-testid="body-params">{JSON.stringify(bodyParams)}</span>
        <span data-testid="products">{JSON.stringify(products)}</span>
      </div>
    );
  };
});

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, fallback) => {
      const translations = {
        'fitService.bodyParams': 'Параметры тела',
        'fitService.height': 'Рост (см)',
        'fitService.chest': 'Обхват груди (см)',
        'fitService.waist': 'Обхват талии (см)',
        'fitService.hips': 'Обхват бёдер (см)',
        'fitService.shoulderWidth': 'Ширина плеч (см)',
        'fitService.selectedProducts': 'Выбранные продукты',
        'fitService.availableProducts': 'Доступные продукты',
        'fitService.noProductsSelected': 'Выберите продукты из списка ниже',
        'fitService.remove': 'Удалить',
        'fitService.type': 'Тип',
        'fitService.color': 'Цвет',
        'fitService.price': 'Цена',
        'fitService.recommendedSize': 'Размер',
        'fitService.fitRegular': 'идеально',
        'fitService.fitTight': 'в обтяжку',
        'fitService.fitLoose': 'свободно',
      };
      return translations[key] || fallback || key;
    },
  }),
}));

describe('MannequinViewer', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Синяя футболка',
      type: 't-shirt',
      color: '#3498db',
      price: 1500,
    },
    {
      id: '2',
      name: 'Белая футболка',
      type: 'shirt',
      color: '#ffffff',
      price: 1200,
    },
  ];

  const defaultBodyParams = {
    height: 175,
    chest: 100,
    waist: 85,
    hips: 95,
    shoulderWidth: 45,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<MannequinViewer />);
    
    expect(screen.getByText('Параметры тела')).toBeInTheDocument();
    expect(screen.getByText('Выбранные продукты')).toBeInTheDocument();
    expect(screen.getByTestId('three-canvas')).toBeInTheDocument();
  });

  it('displays body parameters inputs with correct values', () => {
    render(<MannequinViewer initialBodyParams={defaultBodyParams} />);
    
    // Check that all inputs exist and have correct default values
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBe(5);
    
    // Height input should have value 175
    expect(inputs[0]).toHaveValue(175);
    // Chest input should have value 100
    expect(inputs[1]).toHaveValue(100);
  });

  it('updates body parameters when input changes and blurs', async () => {
    render(<MannequinViewer initialBodyParams={defaultBodyParams} />);
    
    const inputs = screen.getAllByRole('spinbutton');
    const heightInput = inputs[0];
    
    // Change value
    fireEvent.change(heightInput, { target: { value: '180' } });
    expect(heightInput).toHaveValue(180);
    
    // Blur to apply
    fireEvent.blur(heightInput);
    
    // Check that the value is applied to ThreeMannequinCanvas
    await waitFor(() => {
      const canvasParams = screen.getByTestId('body-params');
      expect(canvasParams.textContent).toContain('"height":180');
    });
  });

  it('clamps body parameters to valid range', async () => {
    render(<MannequinViewer initialBodyParams={defaultBodyParams} />);
    
    const inputs = screen.getAllByRole('spinbutton');
    const heightInput = inputs[0];
    
    // Try to set value outside range (height max is 200)
    fireEvent.change(heightInput, { target: { value: '250' } });
    fireEvent.blur(heightInput);
    
    // Should be clamped to 200
    await waitFor(() => {
      expect(heightInput).toHaveValue(200);
    });
  });

  it('displays available products', () => {
    render(<MannequinViewer availableProducts={mockProducts} />);
    
    expect(screen.getByText('Синяя футболка')).toBeInTheDocument();
    expect(screen.getByText('Белая футболка')).toBeInTheDocument();
    expect(screen.getByText('Доступные продукты')).toBeInTheDocument();
  });

  it('selects product when clicked', async () => {
    const onProductsChange = jest.fn();
    render(
      <MannequinViewer
        availableProducts={mockProducts}
        onProductsChange={onProductsChange}
      />
    );
    
    // Click on the first product
    const productCard = screen.getByText('Синяя футболка').closest('div[class*="ProductCard"]');
    fireEvent.click(productCard);
    
    // Should show remove button for selected product
    await waitFor(() => {
      expect(screen.getByText('Удалить')).toBeInTheDocument();
    });
    
    // Check that onProductsChange was called
    expect(onProductsChange).toHaveBeenCalled();
  });

  it('removes product when remove button is clicked', async () => {
    const onProductsChange = jest.fn();
    render(
      <MannequinViewer
        availableProducts={mockProducts}
        onProductsChange={onProductsChange}
      />
    );
    
    // Select a product first
    const productCard = screen.getByText('Синяя футболка').closest('div[class*="ProductCard"]');
    fireEvent.click(productCard);
    
    // Click remove
    await waitFor(() => {
      expect(screen.getByText('Удалить')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Удалить'));
    
    // Should show empty state
    await waitFor(() => {
      expect(screen.getByText('Выберите продукты из списка ниже')).toBeInTheDocument();
    });
  });

  it('shows empty state when no products selected', () => {
    render(<MannequinViewer />);
    
    expect(
      screen.getByText('Выберите продукты из списка ниже')
    ).toBeInTheDocument();
  });

  it('implements mutual exclusion - only one product selected at a time', async () => {
    render(<MannequinViewer availableProducts={mockProducts} />);
    
    // Select first product
    const firstProduct = screen.getByText('Синяя футболка').closest('div[class*="ProductCard"]');
    fireEvent.click(firstProduct);
    
    await waitFor(() => {
      expect(screen.getByText('Удалить')).toBeInTheDocument();
    });
    
    // The selected product should be hidden from available list
    // and only shown in selected products section
    const selectedSection = screen.getByText('Выбранные продукты').parentElement;
    expect(selectedSection).toContainElement(screen.getByText('Синяя футболка'));
    
    // Select second product (should replace first)
    const secondProduct = screen.getByText('Белая футболка').closest('div[class*="ProductCard"]');
    fireEvent.click(secondProduct);
    
    await waitFor(() => {
      // Now the selected product should be "Белая футболка"
      expect(selectedSection).toContainElement(screen.getByText('Белая футболка'));
    });
  });

  it('shows size suggestion for selected product', async () => {
    render(
      <MannequinViewer 
        availableProducts={mockProducts} 
        initialBodyParams={{ ...defaultBodyParams, chest: 100, waist: 80 }}
      />
    );
    
    // Select a product
    const productCard = screen.getByText('Синяя футболка').closest('div[class*="ProductCard"]');
    fireEvent.click(productCard);
    
    // Should show size recommendation (text now includes "Рекомендуемый")
    await waitFor(() => {
      expect(screen.getByText(/Рекомендуемый размер/i)).toBeInTheDocument();
      // Should show a size like M, L, etc.
      expect(screen.getByText(/^(XS|S|M|L|XL)$/)).toBeInTheDocument();
    });
  });

  it('passes correct data to ThreeMannequinCanvas', async () => {
    render(
      <MannequinViewer 
        availableProducts={mockProducts} 
        initialBodyParams={defaultBodyParams}
      />
    );
    
    // Check initial body params are passed
    const canvasParams = screen.getByTestId('body-params');
    expect(canvasParams.textContent).toContain('"height":175');
    expect(canvasParams.textContent).toContain('"chest":100');
    
    // Select a product
    const productCard = screen.getByText('Синяя футболка').closest('div[class*="ProductCard"]');
    fireEvent.click(productCard);
    
    // Check products are passed
    await waitFor(() => {
      const canvasProducts = screen.getByTestId('products');
      expect(canvasProducts.textContent).toContain('"id":"1"');
    });
  });
});
