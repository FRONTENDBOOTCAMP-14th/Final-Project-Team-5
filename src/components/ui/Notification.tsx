'use client';

import { CircleAlert } from 'lucide-react';
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import { useEffect, useRef } from 'react';

type CommonProps = PropsWithChildren<{
  open?: boolean;
  onClose?: () => void;
}>;

type DialogProps = ComponentProps<'dialog'> &
  CommonProps & {
    title: ReactNode;
    contents: ReactNode;
  };
type CustomDialogProps = ComponentProps<'div'> & CommonProps;

export default function Notification({
  title,
  contents,
  open = false,
  onClose,
  children,
}: DialogProps) {
  // dialog DOM 참조
  const dialogRef = useRef<HTMLDialogElement>(null);

  // 모달 열림/닫힘에 따른 showModal/close 및 애니메이션 제어
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="mx-auto my-auto border-0 pt-8 rounded-xl shadow-xl bg-white w-86"
    >
      <CircleAlert className="block mx-auto mb-3" />
      <p className="flex flex-wrap flex-col text-center gap-5 pb-6 px-9">
        <span className="block font-bold">{title}</span>
        <span className="block">{contents}</span>
      </p>
      <div className="border-t-1 border-gray-400">
        {/* 취소 및 돌아가기 버튼 */}
        <button
          type="button"
          className="py-3 px-16 cursor-pointer border-r-1 border-gray-400"
          onClick={onClose}
        >
          버튼1
        </button>
        {/* 확인 및 탈퇴하기 버튼 */}
        <button
          type="button"
          className="py-3 px-16 cursor-pointer"
          onClick={onClose}
        >
          버튼2
        </button>
      </div>
    </dialog>
  );
}
