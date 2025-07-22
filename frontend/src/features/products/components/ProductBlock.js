import React from 'react';
import { Block, BlockImage, BlockContent, BlockTitle, BlockDescription, BlockPrice, AddToCartButton } from './ProductBlockStyles';

const ProductBlock = ({ product }) => {
    return (
        <Block>
            <BlockImage src={product.image} alt={product.name} />
            <BlockContent>
                <BlockTitle>{product.name}</BlockTitle>
                <BlockDescription>{product.description}</BlockDescription>
                <BlockPrice>${product.price}</BlockPrice>
            </BlockContent>
            <AddToCartButton>Add to Cart</AddToCartButton>
        </Block>
    );
};

export default ProductBlock;
