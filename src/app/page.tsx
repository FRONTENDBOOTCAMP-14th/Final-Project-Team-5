import Button from '@/components/ui/Button';
import Frame from '@/components/ui/Frame';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { Toaster } from 'sonner';
import ImageForm from '../components/ui/ImageForm';
import ImageList from '../components/ui/ImageList';

export default function Home() {
  return (
    <Frame>
      <Button>로그인</Button>
      <Input
        id="email"
        name="email"
        label="이메일"
        placeholder="이메일을 입력해주세요."
      />
      <Modal></Modal>
      <Toaster position="top-center" />
      <ImageForm />
      <Spinner size="sm" className="py-2"></Spinner>
      <ImageList src1="/" src2="/" />
    </Frame>
  );
}
