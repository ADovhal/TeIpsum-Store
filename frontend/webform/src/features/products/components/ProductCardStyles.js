// src/components/ProductCard/ProductCardStyles.js
import styled from 'styled-components';

export const Card = styled.div`
    background-color: #ffe7d0;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 215px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.2s ease;
    
    &:hover {
        transform: translateY(-5px);
    }
`;

export const CardImage = styled.img`
    width: 100%;
    height: 150px;
    object-fit: cover;
`;

export const CardContent = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const CardTitle = styled.h3`
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0;
`;

export const CardPrice = styled.p`
    font-size: 16px;
    color: #333;
    margin-bottom: 15px;
`;

export const AddToCartButton = styled.button`
    background-color: #ff6f61;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: #ff4d42;
    }
`;
