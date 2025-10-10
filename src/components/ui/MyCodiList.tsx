// import type { Codi } from '../../libs/supabase/Codilist';

interface MyCodiListProps {
  codiList: Codi[];
}

export default function MyCodiList({ codiList }: MyCodiListProps) {
  const myCodi = codiList.filter(function (codi) {
    return codi.isMyCodi;
  });

  return (
    <div>
      {myCodi.length === 0 ? (
        <p className="text-gray-500">등록한 코디가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {myCodi.map((codi) => (
            <div key={codi.id} className="w-full">
              <img src={codi.imageUrl} alt={`my-codi-${codi.id}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
