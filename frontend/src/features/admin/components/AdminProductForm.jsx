import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { useLanguage } from '../../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createAdminProduct } from '../adminSlice';

// Backend-synchronized enums
const categories = [
  'TOPS', 'BOTTOMS', 'DRESSES_SKIRTS', 'OUTERWEAR', 
  'UNDERWEAR_SLEEPWEAR', 'ACTIVEWEAR', 'SWIMWEAR', 
  'SHOES', 'ACCESSORIES', 'BAGS', 'JEWELRY', 'KIDS', 'BABY'
];

const subcategoriesMap = {
  TOPS: [
    'T_SHIRTS', 'SHIRTS', 'BLOUSES', 'TANK_TOPS', 'HOODIES', 
    'SWEATERS', 'CARDIGANS', 'CROP_TOPS', 'POLO_SHIRTS'
  ],
  BOTTOMS: [
    'JEANS', 'PANTS', 'SHORTS', 'LEGGINGS', 
    'JOGGERS', 'CHINOS', 'CARGO_PANTS'
  ],
  DRESSES_SKIRTS: [
    'CASUAL_DRESSES', 'FORMAL_DRESSES', 'EVENING_DRESSES', 
    'MAXI_DRESSES', 'MINI_SKIRTS', 'MIDI_SKIRTS', 'MAXI_SKIRTS'
  ],
  OUTERWEAR: [
    'COATS', 'JACKETS', 'BLAZERS', 'VESTS', 
    'PARKAS', 'BOMBER_JACKETS', 'LEATHER_JACKETS'
  ],
  UNDERWEAR_SLEEPWEAR: [
    'BRAS', 'PANTIES', 'BOXERS', 'BRIEFS', 
    'PAJAMAS', 'NIGHTGOWNS', 'ROBES', 'LOUNGEWEAR'
  ],
  ACTIVEWEAR: [
    'SPORTS_TOPS', 'SPORTS_BOTTOMS', 'TRACKSUITS', 
    'YOGA_WEAR', 'GYM_WEAR', 'RUNNING_GEAR'
  ],
  SWIMWEAR: [
    'BIKINIS', 'ONE_PIECE', 'SWIM_TRUNKS', 'BOARD_SHORTS', 'COVER_UPS'
  ],
  SHOES: [
    'SNEAKERS', 'BOOTS', 'SANDALS', 'HIGH_HEELS', 
    'FLATS', 'DRESS_SHOES', 'ATHLETIC_SHOES', 'LOAFERS'
  ],
  ACCESSORIES: [
    'BELTS', 'HATS', 'CAPS', 'SCARVES', 
    'GLOVES', 'SUNGLASSES', 'WATCHES', 'TIES'
  ],
  BAGS: [
    'HANDBAGS', 'BACKPACKS', 'TOTE_BAGS', 'CROSSBODY_BAGS', 
    'CLUTCHES', 'WALLETS', 'BRIEFCASES'
  ],
  JEWELRY: [
    'NECKLACES', 'EARRINGS', 'BRACELETS', 'RINGS', 'BROOCHES'
  ],
  KIDS: [
    'BOYS_TOPS', 'BOYS_BOTTOMS', 'BOYS_OUTERWEAR', 
    'GIRLS_TOPS', 'GIRLS_BOTTOMS', 'GIRLS_DRESSES', 
    'GIRLS_OUTERWEAR', 'KIDS_SHOES', 'KIDS_ACCESSORIES'
  ],
  BABY: [
    'BABY_BODYSUITS', 'BABY_SLEEPWEAR', 'BABY_OUTERWEAR', 
    'BABY_SHOES', 'BABY_ACCESSORIES'
  ]
};

// All genders from backend - kept for reference
// const allGenders = ['MEN', 'WOMEN', 'BOYS', 'GIRLS', 'BABY_BOY', 'BABY_GIRL', 'UNISEX'];

// Sizes from backend ClothingSize enum
const sizesMap = {
  ADULT: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  ADULT_NUMERIC: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20'],
  PANTS: ['26', '28', '30', '32', '34', '36', '38', '40', '42', '44'],
  SHOES: ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'],
  KIDS: ['2T', '3T', '4T', 'XS', 'S', 'M', 'L', 'XL'],
  KIDS_NUMERIC: ['4', '5', '6', '7', '8', '10', '12', '14', '16'],
  BABY: ['NB', '0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M'],
  ONE_SIZE: ['One Size']
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,.08);
  max-width: 600px;
  margin: auto;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 768px){
    justify-content: center;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: .2s;
  &.save { background: #27ae60; color: #fff; }
  &.cancel { background: #bdc3c7; color: #fff; }
`;

const ImageUploadSection = styled.div`
  margin: 20px 0;
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background: #f9f9f9;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #3498db;
    background: #f0f8ff;
  }

  &.dragover {
    border-color: #27ae60;
    background: #f0fff0;
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const ImagePreview = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(231, 76, 60, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: #e74c3c;
    transform: scale(1.1);
  }
`;

const UploadText = styled.p`
  margin: 10px 0;
  color: #666;
  font-size: 14px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 100%;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
`;

export default function AdminProductForm({ product, onSave, onCancel }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(product || {});
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState(product?.sizes || []);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Smart filtering functions
  const getAvailableGenders = () => {
    if (form.category === 'KIDS') {
      return ['BOYS', 'GIRLS', 'UNISEX'];
    } else if (form.category === 'BABY') {
      return ['BABY_BOY', 'BABY_GIRL', 'UNISEX'];
    } else {
      return ['MEN', 'WOMEN', 'UNISEX'];
    }
  };

  const getAvailableSubcategories = () => {
    return form.category ? subcategoriesMap[form.category] || [] : [];
  };

  const getAvailableSizes = () => {
    if (!form.category) return [];
    
    if (form.category === 'SHOES') {
      return sizesMap.SHOES;
    } else if (form.category === 'BABY') {
      return sizesMap.BABY;
    } else if (form.category === 'KIDS') {
      return [...sizesMap.KIDS, ...sizesMap.KIDS_NUMERIC];
    } else if (form.category === 'ACCESSORIES' || form.category === 'BAGS' || form.category === 'JEWELRY') {
      return sizesMap.ONE_SIZE;
    } else if (form.category === 'BOTTOMS' && form.subcategory && ['JEANS', 'PANTS'].includes(form.subcategory)) {
      return sizesMap.PANTS;
    } else if (form.category === 'DRESSES_SKIRTS' && form.gender === 'WOMEN') {
      return [...sizesMap.ADULT, ...sizesMap.ADULT_NUMERIC];
    } else {
      return sizesMap.ADULT;
    }
  };

  // Filter subcategories based on gender for gender-specific items
  const getFilteredSubcategories = () => {
    const subcategories = getAvailableSubcategories();
    
    if (form.category === 'UNDERWEAR_SLEEPWEAR' && form.gender) {
      if (form.gender === 'MEN' || form.gender === 'BOYS') {
        return subcategories.filter(sub => !['BRAS', 'PANTIES', 'NIGHTGOWNS'].includes(sub));
      } else if (form.gender === 'WOMEN' || form.gender === 'GIRLS') {
        return subcategories.filter(sub => !['BOXERS', 'BRIEFS'].includes(sub));
      }
    }
    
    if (form.category === 'SWIMWEAR' && form.gender) {
      if (form.gender === 'MEN' || form.gender === 'BOYS') {
        return subcategories.filter(sub => ['SWIM_TRUNKS', 'BOARD_SHORTS'].includes(sub));
      } else if (form.gender === 'WOMEN' || form.gender === 'GIRLS') {
        return subcategories.filter(sub => ['BIKINIS', 'ONE_PIECE', 'COVER_UPS'].includes(sub));
      }
    }
    
    return subcategories;
  };

  // Convert to react-select options with translations
  const getCategoryOptions = () => {
    return categories.map(cat => {
      // Map backend enum to translation key
      const translationKey = cat.toLowerCase()
        .replace('dresses_skirts', 'dressesSkirts')
        .replace('underwear_sleepwear', 'underwearSleepwear')
        .replace(/_/g, '');
      return {
        value: cat,
        label: t(`categoryFilter.${translationKey}`)
      };
    });
  };

  const getSubcategoryOptions = () => {
    return getFilteredSubcategories().map(sub => ({
      value: sub,
      label: t(`subcategoryFilter.${sub.toLowerCase()}`) || sub.replace(/_/g, ' ')
    }));
  };

  const getGenderOptions = () => {
    return getAvailableGenders().map(gender => {
      // Map backend enum to translation key
      const translationKey = gender.toLowerCase()
        .replace('baby_boy', 'babyBoy')
        .replace('baby_girl', 'babyGirl');
      return {
        value: gender,
        label: t(`gender.${translationKey}`)
      };
    });
  };

  const getSizeOptions = () => {
    return getAvailableSizes().map(size => ({
      value: size,
      label: size
    }));
  };

  useEffect(() => {
    if (product?.sizes) {
      setSelectedSizes(product.sizes);
    }
  }, [product]);

  // Reset dependent fields when category changes
  useEffect(() => {
    if (form.category) {
      // Always reset gender when category changes to ensure proper filtering
      setForm(prev => ({ ...prev, gender: '', subcategory: '' }));
      
      // Reset sizes
      setSelectedSizes([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.category]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSelect = (name) => (option) => {
    if (name === 'category') {
      setForm({ 
        ...form, 
        [name]: option?.value || '', 
        subcategory: '',
        gender: '',
        sizes: []
      });
      setSelectedSizes([]);
    } else if (name === 'gender') {
      // When gender changes, reset subcategory if it's not compatible
      const newGender = option?.value || '';
      setForm({ 
        ...form, 
        gender: newGender,
        subcategory: '' // Always reset subcategory when gender changes for simplicity
      });
    } else {
      setForm({ ...form, [name]: option?.value || '' });
    }
  };

  const handleSizeChange = (selectedOptions) => {
    const sizeValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedSizes(sizeValues);
    setForm({ ...form, sizes: sizeValues });
  };

  const handleImageUpload = (files) => {
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(t('onlyImageFiles') || 'Please select only image files');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(t('fileSizeLimit') || 'File size should be less than 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result,
          name: file.name
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = (e) => {
    handleImageUpload(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title?.trim()) return alert(t('titleRequired') || 'Title required');
    if (!form.price || parseFloat(form.price) <= 0) return alert(t('validPriceRequired') || 'Valid price required');
    if (!form.category) return alert(t('categoryRequired') || 'Category required');

    const productPayload = {
      title: form.title.trim(),
      description: form.description?.trim() || '',
      price: parseFloat(form.price),
      discount: form.discount ? parseFloat(form.discount) : null,
      category: form.category,
      subcategory: form.subcategory || null,
      gender: form.gender || null,
      available: form.available !== undefined ? form.available : true,
      sizes: selectedSizes.length ? selectedSizes : null,
      imageUrls: []
    };

    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(productPayload)], {
      type: 'application/json'
    }));

    images.forEach(img => formData.append('images', img.file));

    dispatch(createAdminProduct(formData));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>{t('title')}</Label>
      <Input name="title" value={form.title || ''} onChange={handleChange} required />
    
      <Label>{t('price')}</Label>
      <Input 
        name="price" 
        type="number" 
        step="0.01" 
        min="0.01"
        value={form.price || ''} 
        onChange={handleChange} 
        required 
      />

      <Label>{t('discount')} (%)</Label>
      <Input 
        name="discount" 
        type="number" 
        step="0.01"
        min="0"
        max="100"
        value={form.discount || ''} 
        onChange={handleChange} 
        placeholder={t('optionalDiscountPercentage') || "Optional discount percentage"}
      />

      <Label>{t('description') || 'Description'}</Label>
      <Textarea 
        name="description" 
        value={form.description || ''} 
        onChange={handleChange}
        placeholder={t('enterProductDescription') || "Enter product description..."}
      />

      <Label>{t('category')}</Label>
      <Select
        value={getCategoryOptions().find(c => c.value === form.category)}
        onChange={handleSelect('category')}
        options={getCategoryOptions()}
        placeholder={t('selectCategory') || "Select category..."}
        isClearable
        required
      />

      {form.category && (
        <>
          <Label>{t('genderLabel')}</Label>
          <Select
            value={getGenderOptions().find(g => g.value === form.gender)}
            onChange={handleSelect('gender')}
            options={getGenderOptions()}
            placeholder={t('selectGender') || "Select gender..."}
            isClearable
          />
        </>
      )}

      {form.category && getFilteredSubcategories().length > 0 && (
        <>
          <Label>{t('subcategory')}</Label>
          <Select
            value={getSubcategoryOptions().find(s => s.value === form.subcategory)}
            onChange={handleSelect('subcategory')}
            options={getSubcategoryOptions()}
            placeholder={t('selectSubcategory') || "Select subcategory..."}
            isClearable
          />
        </>
      )}

      {form.category && getAvailableSizes().length > 0 && (
        <>
          <Label>{t('size')}</Label>
          <Select
            isMulti
            value={getSizeOptions().filter(s => selectedSizes.includes(s.value))}
            onChange={handleSizeChange}
            options={getSizeOptions()}
            placeholder={t('selectAvailableSizes') || "Select available sizes..."}
            closeMenuOnSelect={false}
          />
        </>
      )}

      <Label>{t('availability')}</Label>
      <Select
        value={{ value: form.available !== false, label: form.available !== false ? t('inStock') : t('outOfStock') }}
        onChange={handleSelect('available')}
        options={[
          { value: true, label: t('inStock') },
          { value: false, label: t('outOfStock') },
        ]}
      />

      <ImageUploadSection>
        <Label>{t('productImages') || 'Product Images'}</Label>
        <ImageUploadContainer
          className={dragOver ? 'dragover' : ''}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadText>
            📸 {t('dragDropImages') || 'Drag & drop images here or click to select'}
          </UploadText>
          <UploadText style={{ fontSize: '12px', color: '#999' }}>
            {t('supportedFormats') || 'Supported formats: JPG, PNG, WebP (Max 5MB each)'}
          </UploadText>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
          />
        </ImageUploadContainer>
        
        {images.length > 0 && (
          <ImagePreviewGrid>
            {images.map((image) => (
              <ImagePreview key={image.id}>
                <PreviewImage src={image.preview} alt={image.name} />
                <RemoveImageButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                >
                  ×
                </RemoveImageButton>
              </ImagePreview>
            ))}
          </ImagePreviewGrid>
        )}
      </ImageUploadSection>

      <ButtonGroup>
        <Button type="button" className="cancel" onClick={() => navigate('/store')}>{t('cancel')}</Button>
        <Button type="submit" className="save">{t('save')}</Button>
      </ButtonGroup>
    </Form>
  );
}