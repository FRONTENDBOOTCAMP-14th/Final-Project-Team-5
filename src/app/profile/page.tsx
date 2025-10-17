'use client';

// import CodiList from '../../components/ui/CodiList';
import NavigationBar from '../../components/ui/NavigationBar';
import ProfileSheet from '../../components/ui/ProfileSheet';
import ProfileTab from '../../components/ui/ProfileTab';
// import { codiList } from '../../libs/supabase/Codilist';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ProfileSheet />
      <ProfileTab />
      {/* <CodiList /> */}
      <NavigationBar />
    </div>
  );
}
