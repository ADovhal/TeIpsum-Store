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
        
        if (name === 'category') {
            // When category changes, check if current gender is still valid
            const availableGenders = getAvailableGenders(value);
            const updates = { [name]: value };
            
            // Reset gender if it's not available for the new category
            if (filters.gender && !availableGenders.includes(filters.gender)) {
                updates.gender = '';
            }
            
            // Always reset subcategory when category changes
            updates.subcategory = '';
            
            onFilterChange(updates);
        } else {
            onFilterChange({ [name]: value });
        }
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
            'TOPS': ['T_SHIRTS', 'SHIRTS', 'BLOUSES', 'TANK_TOPS', 'HOODIES', 'SWEATERS', 'CARDIGANS', 'CROP_TOPS', 'POLO_SHIRTS'],
            'BOTTOMS': ['JEANS', 'PANTS', 'SHORTS', 'LEGGINGS', 'JOGGERS', 'CHINOS', 'CARGO_PANTS'],
            'DRESSES_SKIRTS': ['CASUAL_DRESSES', 'FORMAL_DRESSES', 'EVENING_DRESSES', 'MAXI_DRESSES', 'MINI_SKIRTS', 'MIDI_SKIRTS', 'MAXI_SKIRTS'],
            'OUTERWEAR': ['COATS', 'JACKETS', 'BLAZERS', 'VESTS', 'PARKAS', 'BOMBER_JACKETS', 'LEATHER_JACKETS'],
            'UNDERWEAR_SLEEPWEAR': ['BRAS', 'PANTIES', 'BOXERS', 'BRIEFS', 'PAJAMAS', 'NIGHTGOWNS', 'ROBES', 'LOUNGEWEAR'],
            'ACTIVEWEAR': ['SPORTS_TOPS', 'SPORTS_BOTTOMS', 'TRACKSUITS', 'YOGA_WEAR', 'GYM_WEAR', 'RUNNING_GEAR'],
            'SWIMWEAR': ['BIKINIS', 'ONE_PIECE', 'SWIM_TRUNKS', 'BOARD_SHORTS', 'COVER_UPS'],
            'SHOES': ['SNEAKERS', 'BOOTS', 'SANDALS', 'HIGH_HEELS', 'FLATS', 'DRESS_SHOES', 'ATHLETIC_SHOES', 'LOAFERS'],
            'ACCESSORIES': ['BELTS', 'HATS', 'CAPS', 'SCARVES', 'GLOVES', 'SUNGLASSES', 'WATCHES', 'TIES'],
            'BAGS': ['HANDBAGS', 'BACKPACKS', 'TOTE_BAGS', 'CROSSBODY_BAGS', 'CLUTCHES', 'WALLETS', 'BRIEFCASES'],
            'JEWELRY': ['NECKLACES', 'EARRINGS', 'BRACELETS', 'RINGS', 'BROOCHES'],
            'KIDS': ['BOYS_TOPS', 'BOYS_BOTTOMS', 'BOYS_OUTERWEAR', 'GIRLS_TOPS', 'GIRLS_BOTTOMS', 'GIRLS_DRESSES', 'GIRLS_OUTERWEAR', 'KIDS_SHOES', 'KIDS_ACCESSORIES'],
            'BABY': ['BABY_BODYSUITS', 'BABY_SLEEPWEAR', 'BABY_OUTERWEAR', 'BABY_SHOES', 'BABY_ACCESSORIES']
        };
        return subcategoryMap[category] || [];
    };

    const getAvailableGenders = (category) => {
        if (!category) {
            // When no category is selected, show all genders for search flexibility
            return ['MEN', 'WOMEN', 'BOYS', 'GIRLS', 'BABY_BOY', 'BABY_GIRL', 'UNISEX'];
        }
        
        if (category === 'KIDS') {
            return ['BOYS', 'GIRLS', 'UNISEX'];
        } else if (category === 'BABY') {
            return ['BABY_BOY', 'BABY_GIRL', 'UNISEX'];
        } else {
            return ['MEN', 'WOMEN', 'UNISEX'];
        }
    };

    return (
        <FilterContainer>
            <FilterTitle>{t('filter')}</FilterTitle>

            <FilterSection>
                <SectionTitle>{t('categories')}</SectionTitle>
                <FilterItem>
                    <Select name="category" value={filters.category} onChange={handleChange}>
                        <option value="">{t('allCategories')}</option>
                        <option value="TOPS">{t('categoryFilter.tops')}</option>
                        <option value="BOTTOMS">{t('categoryFilter.bottoms')}</option>
                        <option value="DRESSES_SKIRTS">{t('categoryFilter.dressesSkirts')}</option>
                        <option value="OUTERWEAR">{t('categoryFilter.outerwear')}</option>
                        <option value="UNDERWEAR_SLEEPWEAR">{t('categoryFilter.underwearSleepwear')}</option>
                        <option value="ACTIVEWEAR">{t('categoryFilter.activewear')}</option>
                        <option value="SWIMWEAR">{t('categoryFilter.swimwear')}</option>
                        <option value="SHOES">{t('categoryFilter.shoes')}</option>
                        <option value="ACCESSORIES">{t('categoryFilter.accessories')}</option>
                        <option value="BAGS">{t('categoryFilter.bags')}</option>
                        <option value="JEWELRY">{t('categoryFilter.jewelry')}</option>
                        <option value="KIDS">{t('categoryFilter.kids')}</option>
                        <option value="BABY">{t('categoryFilter.baby')}</option>
                    </Select>
                </FilterItem>
            </FilterSection>

            {filters.category && (
                <FilterSection>
                    <SectionTitle>{t('subcategory')}</SectionTitle>
                    <FilterItem>
                        <Select name="subcategory" value={filters.subcategory} onChange={handleChange}>
                            <option value="">{t('allSubcategories')}</option>
                            {getSubcategories(filters.category).map(sub => (
                                <option key={sub} value={sub}>
                                    {t(`subcategoryFilter.${sub.toLowerCase()}`)}
                                </option>
                            ))}
                        </Select>
                    </FilterItem>
                </FilterSection>
            )}

            <FilterSection>
                <SectionTitle>{t('genderLabel')}</SectionTitle>
                <FilterItem>
                    <Select name="gender" value={filters.gender} onChange={handleChange}>
                        <option value="">{t('allGenders')}</option>
                        {getAvailableGenders(filters.category).map(gender => {
                            const translationKey = gender.toLowerCase()
                                .replace('baby_boy', 'babyBoy')
                                .replace('baby_girl', 'babyGirl');
                            return (
                                <option key={gender} value={gender}>
                                    {t(`gender.${translationKey}`)}
                                </option>
                            );
                        })}
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
