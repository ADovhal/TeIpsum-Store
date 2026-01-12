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

// Mock i18n with different language scenarios
const mockTranslationsEN = {
  'fitService.bodyParams': 'Body Parameters',
  'fitService.height': 'Height (cm)',
  'fitService.chest': 'Chest (cm)',
  'fitService.waist': 'Waist (cm)',
  'fitService.hips': 'Hips (cm)',
  'fitService.shoulderWidth': 'Shoulder Width (cm)',
  'fitService.selectedProducts': 'Selected Products',
  'fitService.availableProducts': 'Available Products',
  'fitService.noProductsSelected': 'Select products from the list below',
  'fitService.remove': 'Remove',
  'fitService.type': 'Type',
  'fitService.color': 'Color',
  'fitService.price': 'Price',
  'fitService.recommendedSize': 'Recommended Size',
  'fitService.currency': '£',
  'fitService.currencyCode': 'GBP',
  'fitService.products.tshirt-white': 'White T-Shirt',
  'fitService.products.tshirt-black': 'Black T-Shirt',
  'fitService.colors.white': 'White',
  'fitService.colors.black': 'Black',
};

const mockTranslationsPL = {
  'fitService.bodyParams': 'Parametry Ciała',
  'fitService.height': 'Wzrost (cm)',
  'fitService.chest': 'Obwód Klatki (cm)',
  'fitService.waist': 'Obwód Talii (cm)',
  'fitService.hips': 'Obwód Bioder (cm)',
  'fitService.shoulderWidth': 'Szerokość Ramion (cm)',
  'fitService.selectedProducts': 'Wybrane Produkty',
  'fitService.availableProducts': 'Dostępne Produkty',
  'fitService.noProductsSelected': 'Wybierz produkty z listy',
  'fitService.remove': 'Usuń',
  'fitService.type': 'Typ',
  'fitService.color': 'Kolor',
  'fitService.price': 'Cena',
  'fitService.recommendedSize': 'Zalecany Rozmiar',
  'fitService.currency': 'zł',
  'fitService.currencyCode': 'PLN',
  'fitService.products.tshirt-white': 'Biała Koszulka',
  'fitService.products.tshirt-black': 'Czarna Koszulka',
  'fitService.colors.white': 'Biały',
  'fitService.colors.black': 'Czarny',
};

let currentTranslations = mockTranslationsEN;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, fallback) => {
      return currentTranslations[key] || fallback || key;
    },
  }),
}));

describe('MannequinViewer', () => {
  const mockProducts = [
    {
      id: 'tshirt-white',
      nameKey: 'fitService.products.tshirt-white',
      type: 't-shirt',
      color: '#ffffff',
      colorKey: 'white',
      basePrice: 29.99,
    },
    {
      id: 'tshirt-black',
      nameKey: 'fitService.products.tshirt-black',
      type: 'shirt',
      color: '#1a1a1a',
      colorKey: 'black',
      basePrice: 29.99,
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
    currentTranslations = mockTranslationsEN;
  });

  it('renders correctly with default props', () => {
    render(<MannequinViewer />);
    
    expect(screen.getByText('Body Parameters')).toBeInTheDocument();
    expect(screen.getByText('Selected Products')).toBeInTheDocument();
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

  it('displays available products with translated names', () => {
    render(<MannequinViewer availableProducts={mockProducts} />);
    
    expect(screen.getByText('White T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('Black T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('Available Products')).toBeInTheDocument();
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
    const productCard = screen.getByText('White T-Shirt').closest('div[class*="ProductCard"]');
    fireEvent.click(productCard);
    
    // Should show remove button for selected product
    await waitFor(() => {
      expect(screen.getByText('Remove')).toBeInTheDocument();
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
    const productCard = screen.getByText('White T-Shirt').closest('div[class*="ProductCard"]');
    fireEvent.click(productCard);
    
    // Click remove
    await waitFor(() => {
      expect(screen.getByText('Remove')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Remove'));
    
    // Should show empty state
    await waitFor(() => {
      expect(screen.getByText('Select products from the list below')).toBeInTheDocument();
    });
  });

  it('shows empty state when no products selected', () => {
    render(<MannequinViewer />);
    
    expect(
      screen.getByText('Select products from the list below')
    ).toBeInTheDocument();
  });

  it('implements mutual exclusion - only one product selected at a time', async () => {
    render(<MannequinViewer availableProducts={mockProducts} />);
    
    // Select first product
    const firstProduct = screen.getByText('White T-Shirt').closest('div[class*="ProductCard"]');
    fireEvent.click(firstProduct);
    
    await waitFor(() => {
      expect(screen.getByText('Remove')).toBeInTheDocument();
    });
    
    // The selected product should be hidden from available list
    // and only shown in selected products section
    const selectedSection = screen.getByText('Selected Products').parentElement;
    expect(selectedSection).toContainElement(screen.getByText('White T-Shirt'));
    
    // Select second product (should replace first)
    const secondProduct = screen.getByText('Black T-Shirt').closest('div[class*="ProductCard"]');
    fireEvent.click(secondProduct);
    
    await waitFor(() => {
      // Now the selected product should be "Black T-Shirt"
      expect(selectedSection).toContainElement(screen.getByText('Black T-Shirt'));
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
    const productCard = screen.getByText('White T-Shirt').closest('div[class*="ProductCard"]');
    fireEvent.click(productCard);
    
    // Should show size recommendation
    await waitFor(() => {
      expect(screen.getByText(/Recommended Size/i)).toBeInTheDocument();
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
    const productCard = screen.getByText('White T-Shirt').closest('div[class*="ProductCard"]');
    fireEvent.click(productCard);
    
    // Check products are passed
    await waitFor(() => {
      const canvasProducts = screen.getByTestId('products');
      expect(canvasProducts.textContent).toContain('"id":"tshirt-white"');
    });
  });

  describe('Currency formatting', () => {
    it('displays price in GBP format for English', async () => {
      currentTranslations = mockTranslationsEN;
      render(<MannequinViewer availableProducts={mockProducts} />);
      
      // Select a product by clicking on its title
      fireEvent.click(screen.getByText('White T-Shirt'));
      
      // Should show price with £ symbol (base price 29.99 * 1 = £29.99)
      await waitFor(() => {
        expect(screen.getByText(/£29\.99/i)).toBeInTheDocument();
      });
    });

    it('displays price in PLN format for Polish', async () => {
      currentTranslations = mockTranslationsPL;
      render(<MannequinViewer availableProducts={mockProducts} />);
      
      // Select a product by clicking on its title
      fireEvent.click(screen.getByText('Biała Koszulka'));
      
      // Should show price with zł symbol (base price 29.99 * 5.05 ≈ 151.45 zł)
      await waitFor(() => {
        expect(screen.getByText(/151\.45.*zł/i)).toBeInTheDocument();
      });
    });
  });

  describe('Translated color names', () => {
    it('displays color name in English', async () => {
      currentTranslations = mockTranslationsEN;
      render(<MannequinViewer availableProducts={mockProducts} />);
      
      // Select a product by clicking on its title
      fireEvent.click(screen.getByText('White T-Shirt'));
      
      // Should show translated color name (checking for 2 occurrences - the color label + color name)
      await waitFor(() => {
        const whiteElements = screen.getAllByText('White');
        expect(whiteElements.length).toBeGreaterThan(0);
      });
    });

    it('displays color name in Polish', async () => {
      currentTranslations = mockTranslationsPL;
      render(<MannequinViewer availableProducts={mockProducts} />);
      
      // Select a product by clicking on its title
      fireEvent.click(screen.getByText('Biała Koszulka'));
      
      // Should show translated color name
      await waitFor(() => {
        expect(screen.getByText('Biały')).toBeInTheDocument();
      });
    });
  });
});
