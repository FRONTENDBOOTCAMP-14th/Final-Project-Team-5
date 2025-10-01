import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Frame from '@/components/ui/Frame';

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
    </Frame>
  );
}
