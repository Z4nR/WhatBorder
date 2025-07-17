import React from 'react';
import useUserState from '@/utils/state/userState';
import CompareAdminMapPages from '../admin/desktop/CompareAdminMapPages';
import CompareUserMapPages from '../user/desktop/compare-map/CompareUserMapPages';

const CompareMapPages: React.FC = () => {
  const role = useUserState().role;
  return role === 3 ? <CompareUserMapPages /> : <CompareAdminMapPages />;
};

export default CompareMapPages;
