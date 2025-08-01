import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';

const FilterContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 280px;
  height: fit-content;
  position: sticky;
  top: 20px;

  @media (max-width: 1045px) {
    width: 100%;
    margin-bottom: 20px;
    position: static;
  }
`;

const FilterTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 12px;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #34495e;
`;

const FilterItem = styled.div`
  margin-bottom: 16px;
`;

// const Label = styled.label`
//   display: block;
//   margin-bottom: 6px;
//   font-size: 14px;
//   font-weight: 500;
//   color: #7f8c8d;
// `;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  &:hover {
    border-color: #bdc3c7;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  &:hover {
    border-color: #bdc3c7;
  }
`;

const PriceRangeContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const PriceInput = styled(Input)`
  flex: 1;
`;

const PriceSeparator = styled.span`
  color: #7f8c8d;
  font-weight: 500;
`;

// const RatingContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
// `;

// const RatingOption = styled.label`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   cursor: pointer;
//   padding: 8px;
//   border-radius: 6px;
//   transition: background-color 0.2s ease;

//   &:hover {
//     background: #f8f9fa;
//   }
// `;

// const RadioInput = styled.input`
//   margin: 0;
//   cursor: pointer;
// `;

// const RatingText = styled.span`
//   font-size: 14px;
//   color: #2c3e50;
// `;

// const Stars = styled.span`
//   color: #f39c12;
//   font-size: 16px;
// `;

const ClearFiltersButton = styled.button`
  width: 100%;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 16px;

  &:hover {
    background: #c0392b;
  }
`;

const FilterSidebar = ({ filters, onFilterChange }) => {
    const { t } = useLanguage();
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'minPrice' && value < 0) return;
        if (name === 'maxPrice' && value < 0) return;
        if (name === 'minDiscount' && (value < 0 || value > 100)) return;
        if (name === 'maxDiscount' && (value < 0 || value > 100)) return;
        onFilterChange({ [name]: value });
    };

    const handleClearFilters = () => {
        onFilterChange({
            category: '',
            subcategory: '',
            gender: '',
            minPrice: 0,
            maxPrice: 1000,
            minDiscount: 0,
            maxDiscount: 100,
            available: true,
        });
    };

    const getSubcategories = (category) => {
        const subcategoryMap = {
            'MENS_CLOTHING': ['T_SHIRTS', 'SHIRTS', 'PANTS', 'JEANS', 'JACKETS'],
            'WOMENS_CLOTHING': ['T_SHIRTS', 'SHIRTS', 'PANTS', 'JEANS', 'JACKETS'],
            'KIDS_CLOTHING': ['BOYS_CLOTHING', 'GIRLS_CLOTHING', 'BABY_CLOTHING', 'JEANS', 'JACKETS'],
            'ACCESSORIES': ['BAGS', 'BELTS', 'HATS', 'SUNGLASSES'],
            'SHOES': ['SNEAKERS', 'BOOTS', 'SANDALS', 'DRESS_SHOES']
        };
        return subcategoryMap[category] || [];
    };

    return (
        <FilterContainer>
            <FilterTitle>{t('filter')}</FilterTitle>

            <FilterSection>
                <SectionTitle>{t('categories')}</SectionTitle>
                <FilterItem>
                    <Select name="category" value={filters.category} onChange={handleChange}>
                        <option value="">{t('allCategories')}</option>
                        <option value="MENS_CLOTHING">{t('men')}</option>
                        <option value="WOMENS_CLOTHING">Women's Clothing</option>
                        <option value="KIDS_CLOTHING">Kids' Clothing</option>
                        <option value="ACCESSORIES">Accessories</option>
                        <option value="SHOES">Shoes</option>
                    </Select>
                </FilterItem>
            </FilterSection>

            {filters.category && (
                <FilterSection>
                    <SectionTitle>Subcategory</SectionTitle>
                    <FilterItem>
                        <Select name="subcategory" value={filters.subcategory} onChange={handleChange}>
                            <option value="">All Subcategories</option>
                            {getSubcategories(filters.category).map(sub => (
                                <option key={sub} value={sub}>
                                    {sub.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </option>
                            ))}
                        </Select>
                    </FilterItem>
                </FilterSection>
            )}

            <FilterSection>
                <SectionTitle>{t('gender')}</SectionTitle>
                <FilterItem>
                    <Select name="gender" value={filters.gender} onChange={handleChange}>
                        <option value="">{t('allGenders')}</option>
                        <option value="MEN">{t('men')}</option>
                        <option value="WOMEN">{t('women')}</option>
                        <option value="UNISEX">{t('unisex')}</option>
                    </Select>
                </FilterItem>
            </FilterSection>

            <FilterSection>
                <SectionTitle>{t('price')}</SectionTitle>
                <FilterItem>
                    <PriceRangeContainer>
                        <PriceInput
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleChange}
                            placeholder="Min"
                            min="0"
                        />
                        <PriceSeparator>{t('upTo')}</PriceSeparator>
                        <PriceInput
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            placeholder="Max"
                            min="0"
                        />
                    </PriceRangeContainer>
                </FilterItem>
            </FilterSection>

            <FilterSection>
                <SectionTitle>{t('discount')} (%)</SectionTitle>
                <FilterItem>
                    <PriceRangeContainer>
                        <PriceInput
                            type="number"
                            name="minDiscount"
                            value={filters.minDiscount}
                            onChange={handleChange}
                            placeholder="Min"
                            min="0"
                            max="100"
                        />
                        <PriceSeparator>{t('upTo')}</PriceSeparator>
                        <PriceInput
                            type="number"
                            name="maxDiscount"
                            value={filters.maxDiscount}
                            onChange={handleChange}
                            placeholder="Max"
                            min="0"
                            max="100"
                        />
                    </PriceRangeContainer>
                </FilterItem>
            </FilterSection>

            <FilterSection>
                <SectionTitle>{t('availability')}</SectionTitle>
                <FilterItem>
                    <Select name="available" value={filters.available} onChange={handleChange}>
                        <option value="">{t('all')}</option>
                        <option value="true">{t('inStock')}</option>
                        <option value="false">{t('outOfStock')}</option>
                    </Select>
                </FilterItem>
            </FilterSection>

            <ClearFiltersButton onClick={handleClearFilters}>
                {t('clearFilters')}
            </ClearFiltersButton>
        </FilterContainer>
    );
};

export default FilterSidebar;
