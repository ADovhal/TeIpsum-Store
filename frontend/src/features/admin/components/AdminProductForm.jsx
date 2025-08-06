import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { useLanguage } from '../../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createAdminProduct } from '../adminSlice';

const categories = [
  { value: 'MENS_CLOTHING', label: "Men's Clothing" },
  { value: 'WOMENS_CLOTHING', label: "Women's Clothing" },
  { value: 'KIDS_CLOTHING', label: "Kids' Clothing" },
  { value: 'ACCESSORIES', label: 'Accessories' },
  { value: 'SHOES', label: 'Shoes' },
];

const subcategoriesMap = {
  MENS_CLOTHING: [
    { value: 'T_SHIRTS', label: 'T-Shirts' },
    { value: 'SHIRTS', label: 'Shirts' },
    { value: 'PANTS', label: 'Pants' },
    { value: 'JEANS', label: 'Jeans' },
    { value: 'JACKETS', label: 'Jackets' },
  ],
  WOMENS_CLOTHING: [
    { value: 'T_SHIRTS', label: 'T-Shirts' },
    { value: 'SHIRTS', label: 'Shirts' },
    { value: 'PANTS', label: 'Pants' },
    { value: 'JEANS', label: 'Jeans' },
    { value: 'JACKETS', label: 'Jackets' },
  ],
  KIDS_CLOTHING: [
    { value: 'BOYS_CLOTHING', label: "Boys' Clothing" },
    { value: 'GIRLS_CLOTHING', label: "Girls' Clothing" },
    { value: 'BABY_CLOTHING', label: 'Baby Clothing' },
    { value: 'JEANS', label: 'Jeans' },
    { value: 'JACKETS', label: 'Jackets' },
  ],
  ACCESSORIES: [
    { value: 'BAGS', label: 'Bags' },
    { value: 'BELTS', label: 'Belts' },
    { value: 'HATS', label: 'Hats' },
    { value: 'SUNGLASSES', label: 'Sunglasses' },
  ],
  SHOES: [
    { value: 'SNEAKERS', label: 'Sneakers' },
    { value: 'BOOTS', label: 'Boots' },
    { value: 'SANDALS', label: 'Sandals' },
    { value: 'DRESS_SHOES', label: 'Dress Shoes' },
  ],
};

const genders = [
  { value: 'MEN', label: 'Men' },
  { value: 'WOMEN', label: 'Women' },
  { value: 'UNISEX', label: 'Unisex' },
];

const sizes = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
];

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
  const [form, setForm] = React.useState(product || {});
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState(product?.sizes || []);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (product?.sizes) {
      setSelectedSizes(product.sizes);
    }
  }, [product]);

  const getAvailableSubcategories = () => {
    return form.category ? subcategoriesMap[form.category] || [] : [];
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSelect = (name) => (option) => {
    if (name === 'category') {
      setForm({ ...form, [name]: option.value, subcategory: '' });
    } else {
      setForm({ ...form, [name]: option.value });
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
        alert('Please select only image files');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
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

    if (!form.title?.trim()) return alert('Title required');
    if (!form.price || parseFloat(form.price) <= 0) return alert('Valid price required');
    if (!form.category) return alert('Category required');

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
        placeholder="Optional discount percentage"
      />

      <Label>{t('description') || 'Description'}</Label>
      <Textarea 
        name="description" 
        value={form.description || ''} 
        onChange={handleChange}
        placeholder="Enter product description..."
      />

      <Label>{t('category')}</Label>
      <Select
        value={categories.find(c => c.value === form.category)}
        onChange={handleSelect('category')}
        options={categories}
        placeholder="Select category..."
        required
      />

      {form.category && (
        <>
          <Label>{t('subcategory')}</Label>
          <Select
            value={getAvailableSubcategories().find(s => s.value === form.subcategory)}
            onChange={handleSelect('subcategory')}
            options={getAvailableSubcategories()}
            placeholder="Select subcategory..."
            isClearable
          />
        </>
      )}

      <Label>{t('gender')}</Label>
      <Select
        value={genders.find(g => g.value === form.gender)}
        onChange={handleSelect('gender')}
        options={genders}
        placeholder="Select gender..."
        isClearable
      />

      <Label>Available Sizes</Label>
      <Select
        isMulti
        value={sizes.filter(s => selectedSizes.includes(s.value))}
        onChange={handleSizeChange}
        options={sizes}
        placeholder="Select available sizes..."
        closeMenuOnSelect={false}
      />

      <Label>{t('availability')}</Label>
      <Select
        value={{ value: form.available, label: form.available ? t('inStock') : t('outOfStock') }}
        onChange={handleSelect('available')}
        options={[
          { value: true, label: t('inStock') },
          { value: false, label: t('outOfStock') },
        ]}
      />

      <ImageUploadSection>
        <Label>Product Images</Label>
        <ImageUploadContainer
          className={dragOver ? 'dragover' : ''}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadText>
            📸 Drag & drop images here or click to select
          </UploadText>
          <UploadText style={{ fontSize: '12px', color: '#999' }}>
            Supported formats: JPG, PNG, WebP (Max 5MB each)
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