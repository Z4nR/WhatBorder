import { BreadcrumbProps } from '@/utils/types/utils.types';
import { Breadcrumb, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({
  title,
  buttonTitle,
}) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb
      items={[
        {
          onClick: () => navigate(-1),
          title: (
            <Button type="link" className="home-breadcrumb">
              {buttonTitle}
            </Button>
          ),
        },
        {
          title: title,
        },
      ]}
      style={{ marginBottom: '1rem' }}
    />
  );
};

export default BreadcrumbComponent;
