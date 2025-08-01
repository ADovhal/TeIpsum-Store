// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import AdminProductForm from '../../features/admin/components/AdminProductForm';

// export default function AdminProductEditPage() {
//   const { id } = useParams();
//   const product = useSelector(state =>
//     state.products.products.find(p => p.id === Number(id))
//   );
//   return product ? <AdminProductForm product={product} /> : <p>Not found</p>;
// }