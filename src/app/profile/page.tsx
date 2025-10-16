'use client';

// import CodiList from '../../components/ui/CodiList';
import ProfileSheet from '../../components/ui/ProfileSheet';
// import { codiList } from '../../libs/supabase/Codilist';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div>
        <ProfileSheet />
        {/*<ProfileTab codiList={codiList} />*/}
        {/* <NavBar /> */}
      </div>
    </div>
  );
}
