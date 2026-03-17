import type { ReactNode } from 'react';

type MobileDeviceFrameProps = {
  children: ReactNode;
};

const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center p-4 font-sans bg-transparent">
      {/* Mobile Device Frame */}
      <div className="relative w-full max-w-[390px] h-[750px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-slate-800 flex flex-col">
        {/* Status Bar */}
        <div className="h-10 bg-white flex justify-between items-center px-8 pt-4">
          <span className="text-xs font-bold text-slate-800">9:41</span>
        </div>

        {children}
      </div>
    </div>
  );
};

export default MobileDeviceFrame;
