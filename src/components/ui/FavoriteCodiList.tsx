// import { Codi } from '../../libs/supabase/Codilist';
// import CodiList from './CodiList';

interface FavoriteCodiListProps {
  codiList: Codi[];
}

export default function FavoriteCodiList({ codiList }: FavoriteCodiListProps) {
  const favoriteList = codiList.filter(function (codi) {
    return codi.liked;
  });

  return (
    <div>
      {favoriteList.length === 0 ? (
        <p className="text-gray-500">관심 등록한 코디가 없습니다.</p>
      ) : (
        <CodiList items={favoriteList} />
      )}
    </div>
  );
}
