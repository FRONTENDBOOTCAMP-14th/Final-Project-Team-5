
type FrameProps = React.PropsWithChildren<{
  className?: string;
}>;

export default function Frame({ children, className }: FrameProps) {

  return (
    <div className="shadow-[0px_0px_16px_0px_rgba(0,0,0,0.08)] w-[460px] max-w-[460px] h-full h-screen absolute left-1/2 -translate-x-1/2">
        {children}
    </div>
  );
}