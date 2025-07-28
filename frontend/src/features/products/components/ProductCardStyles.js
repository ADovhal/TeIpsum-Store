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
