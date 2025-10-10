'use client';

// 네비바 추가
import ProfileSheet from '../../components/ui/ProfileSheet';
import ProfileTab from '../../components/ui/ProfileTab';
// import { codiList } from '../../libs/supabase/Codilist';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div>
        <ProfileSheet />
        <ProfileTab codiList={codiList} />
        {/* <NavBar /> */}
      </div>
    </div>
  );
}
