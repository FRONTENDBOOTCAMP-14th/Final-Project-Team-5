import Image from 'next/image';

interface ImageProps {
  src: string;
  children?: React.ReactNode;
}

export default function ImageList({ src, children }: ImageProps) {
  return (
    <div className="relative flex justify-center w-[135px] h-[135px]">
      <Image
        src={src}
        alt="코디사진"
        fill
        className="rounded-xl object-cover cursor-pointer bg-pink-300"
      />
      {children}
    </div>
  );
}
