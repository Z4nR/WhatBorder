import { placeDetail } from '../utils/networks';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const PlaceDetail: React.FC = () => {
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ['place', id],
    queryFn: async () => await placeDetail(id),
  });

  console.log(data);

  return <p>Place Detail</p>;
};

export default PlaceDetail;
