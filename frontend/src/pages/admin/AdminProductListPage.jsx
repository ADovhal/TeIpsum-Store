// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProducts } from '../../features/products/productSlice';
// import { Link } from 'react-router-dom';

// export default function AdminProductListPage() {
//   const dispatch = useDispatch();
//   const { products, loading } = useSelector(s => s.products);

//   useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>Admin – Products</h1>
//       {products.map(p => (
//         <div key={p.id}>
//           <span>{p.name}</span>
//           <Link to={`/admin/products/${p.id}/edit`}>Edit</Link>
//         </div>
//       ))}
//     </div>
//   );
// }