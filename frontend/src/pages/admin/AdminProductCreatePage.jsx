import { useLanguage } from '../../context/LanguageContext';
import AdminProductForm from '../../features/admin/components/AdminProductForm';

export default function AdminProductCreatePage() {
    const { t } = useLanguage();

//   return <AdminProductForm />;

    return (
        <div style={{ padding: 40 }}>
          <h1 style={{textAlign: 'center'}}>{t('addNewProduct')}</h1>
          <AdminProductForm />
        </div>
    );
}