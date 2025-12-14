import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const DialogContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const DialogTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
`;

const DialogDescription = styled.p`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
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
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.primary ? `
    background: #3498db;
    color: white;
    &:hover {
      background: #2980b9;
    }
  ` : `
    background: #ecf0f1;
    color: #2c3e50;
    &:hover {
      background: #bdc3c7;
    }
  `}
`;

/**
 * Dialog for setting body parameters on first visit
 */
const BodyParamsDialog = ({ onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    height: '',
    chest: '',
    waist: '',
    hips: '',
    shoulderWidth: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {
      height: parseFloat(formData.height) || 175,
      chest: parseFloat(formData.chest) || 100,
      waist: parseFloat(formData.waist) || 85,
      hips: parseFloat(formData.hips) || 95,
      shoulderWidth: parseFloat(formData.shoulderWidth) || 45,
    };
    onSave(params);
  };

  return (
    <DialogOverlay onClick={onCancel}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogTitle>{t('fitService.firstTimeTitle')}</DialogTitle>
        <DialogDescription>{t('fitService.firstTimeDescription')}</DialogDescription>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>{t('fitService.height')}</Label>
            <Input
              type="number"
              min="150"
              max="220"
              value={formData.height}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder="175"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>{t('fitService.chest')}</Label>
            <Input
              type="number"
              min="80"
              max="150"
              value={formData.chest}
              onChange={(e) => handleChange('chest', e.target.value)}
              placeholder="100"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>{t('fitService.waist')}</Label>
            <Input
              type="number"
              min="60"
              max="130"
              value={formData.waist}
              onChange={(e) => handleChange('waist', e.target.value)}
              placeholder="85"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>{t('fitService.hips')}</Label>
            <Input
              type="number"
              min="80"
              max="150"
              value={formData.hips}
              onChange={(e) => handleChange('hips', e.target.value)}
              placeholder="95"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>{t('fitService.shoulderWidth')}</Label>
            <Input
              type="number"
              min="35"
              max="60"
              value={formData.shoulderWidth}
              onChange={(e) => handleChange('shoulderWidth', e.target.value)}
              placeholder="45"
              required
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={onCancel}>
              {t('fitService.cancel')}
            </Button>
            <Button type="submit" primary>
              {t('fitService.save')}
            </Button>
          </ButtonGroup>
        </form>
      </DialogContent>
    </DialogOverlay>
  );
};

export default BodyParamsDialog;

