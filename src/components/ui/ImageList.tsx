import Image, { StaticImageData } from 'next/image';

interface ImageProps {
  src1: string | StaticImageData;
  src2: string | StaticImageData;
}

export default function ImageList({ src1, src2 }: ImageProps) {
  return (
    <div className="flex flex-row justify-center gap-11.5">
      <Image
        src={src1}
        alt="코디사진"
        width={135}
        height={135}
        className="rounded-xl cursor-pointer bg-pink-300"
      />
      <Image
        src={src2}
        alt="코디사진"
        width={135}
        height={135}
        className="rounded-xl cursor-pointer bg-blue-300"
      />
    </div>
  );
}
