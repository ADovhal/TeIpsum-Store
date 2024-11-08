// src/components/ProductBlock/ProductBlockStyles.js
import styled from 'styled-components';

export const Block = styled.div`
    background-color: #ffe7d0;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 15px 200px 15px 200px;
    margin: 15px 0;
    transition: transform 0.2s ease;
    width: 90%;

    &:hover {
        transform: translateY(-5px);
    }
`;

export const BlockImage = styled.img`
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 20px;
`;

export const BlockContent = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

export const BlockTitle = styled.h3`
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    color: #333;
`;

export const BlockDescription = styled.p`
    font-size: 14px;
    color: #666;
    margin: 10px 0 15px 0;
    line-height: 1.5;
    max-width: 80%;
`;

export const BlockPrice = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: #333;
`;

export const AddToCartButton = styled.button`
    background-color: #ff6f61;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    align-self: center;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #ff4d42;
    }
`;
