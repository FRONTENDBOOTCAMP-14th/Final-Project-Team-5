'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useCodiStore } from '../../libs/supabase/codistore';
import ImageForm from './ImageForm';
import ImageList from './ImageList';

export default function MyCodiList() {
  const { codiList, removeCodi } = useCodiStore();
  const myCodi = codiList.filter((codi) => codi.isMyCodi);
  const [showForm, setShowForm] = useState(myCodi.length === 0);

  useEffect(() => {
    if (myCodi.length === 0) {
      setShowForm(true);
    }
  }, [myCodi.length]);

  if (showForm) {
    return (
      <ImageForm
        onBack={myCodi.length > 0 ? () => setShowForm(false) : undefined}
      />
    );
  }

  return (
    <div>
      {myCodi.length > 0 && (
        <>
          <div className="max-w-md mx-auto w-full justify-items-center grid grid-cols-2 gap-4 p-4">
            {myCodi.map((codi) => (
              <ImageList key={codi.id} src={codi.imageUrl}>
                <button
                  onClick={() => removeCodi(codi.id)}
                  className="absolute top-0 right-0 bg-white text-black p-0.5 rounded-full border-2 border-black"
                >
                  <X size={8} />
                </button>
              </ImageList>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="w-1/2 flex justify-center my-4 border-2 rounded-2xl border-black"
            >
              나의 코디 등록하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
