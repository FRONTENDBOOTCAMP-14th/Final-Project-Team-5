'use client';

import React from 'react';
import Image from 'next/image';

interface ImageProps {
  src: string;
  children?: React.ReactNode;
}

export default function ImageList({ src, children }: ImageProps) {
  return (
    <div
      className="relative flex justify-center w-[100%] aspect-square"
      onDragStart={(e) => e.preventDefault()}
    >
      <Image
        src={src}
        alt="코디사진"
        fill
        draggable={false}
        className="
          rounded-xl object-cover bg-pink-300
          select-none
          [-webkit-user-drag:none]
        "
      />
      <div>{children}</div>
    </div>
  );
}
