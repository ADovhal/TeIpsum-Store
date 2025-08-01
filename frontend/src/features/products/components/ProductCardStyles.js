import styled from 'styled-components';

export const Card = styled.div`
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 280px;
    margin: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    
    &:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
        width: 240px;
        margin: 12px;
    }
`;

export const CardImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s ease;
    
    ${Card}:hover & {
        transform: scale(1.05);
    }
`;

export const CardContent = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
`;

export const CardTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #2c3e50;
    text-align: center;
    line-height: 1.3;
`;

export const CardDescription = styled.p`
    font-size: 14px;
    color: #7f8c8d;
    margin: 0 0 12px 0;
    text-align: center;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

export const CardPrice = styled.div`
    font-size: 20px;
    font-weight: 700;
    color: #e74c3c;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const PriceLabel = styled.span`
    font-size: 14px;
    color: #95a5a6;
    font-weight: 400;
`;

export const AddToCartButton = styled.button`
    background: linear-gradient(135deg, #ff6f61 0%, #ff8a80 100%);
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    width: 100%;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    &:hover {
        background: linear-gradient(135deg, #ff4d42 0%, #ff6f61 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(255, 111, 97, 0.3);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;

export const ProductBadge = styled.div`
    position: absolute;
    top: 12px;
    right: 12px;
    background: ${props => props.type === 'sale' ? '#e74c3c' : '#27ae60'};
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    z-index: 1;
`;

export const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 12px;
`;

export const Star = styled.span`
    color: ${props => props.filled ? '#f39c12' : '#ecf0f1'};
    font-size: 16px;
`;

export const RatingText = styled.span`
    font-size: 14px;
    color: #7f8c8d;
    margin-left: 4px;
`;

export const EditIcon = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  z-index: 2;
  &:hover {
    background: rgba(0,0,0,0.8);
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

export const ImageNavigation = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  ${props => props.direction === 'left' ? 'left: 10px;' : 'right: 10px;'}
`;

export const NavButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #2c3e50;
  transition: all 0.3s ease;
  opacity: 0;
  pointer-events: none;

  ${Card}:hover & {
    opacity: 1;
    pointer-events: auto;
  }

  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

export const ImageIndicators = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  z-index: 2;
`;

export const Indicator = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: #fff;
  }
`;

export const ProductAttributes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
  justify-content: center;
`;

export const AttributeTag = styled.span`
  background: ${props => {
    switch (props.type) {
      case 'category': return '#3498db';
      case 'gender': return '#9b59b6';
      case 'availability': return props.available ? '#27ae60' : '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const AdminInfo = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 12px;
  font-size: 11px;
  color: #6c757d;
`;

export const AdminInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const AdminLabel = styled.span`
  font-weight: 600;
`;

export const AdminValue = styled.span`
  font-family: monospace;
`;