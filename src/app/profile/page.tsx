import Frame from '@/components/ui/Frame';
import NavigationBar from '@/components/ui/NavigationBar';
import ProfileSheet from '@/components/ui/ProfileSheet';
import ProfileTab from '@/components/ui/ProfileTab';

export default function ProfilePage() {
  return (
    <Frame>
      <div className="flex flex-col min-h-screen bg-white">
        <ProfileSheet />
        <ProfileTab />
        <NavigationBar />
      </div>
    </Frame>
  );
}
