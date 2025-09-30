import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export default function Home() {
  return (
    <div>
      <Button>로그인</Button>
      <Input
        id="email"
        name="email"
        label="이메일"
        placeholder="이메일을 입력해주세요."
      />
    </div>
  );
}
