interface ItemProps {
  title?: string;
  desc?: string;
  icon?: any;
  children?: React.ReactNode;
}

export function NoItemAdded({ title, desc, icon, children }: ItemProps) {
  return (
    <div className="flex justify-center items-end self-stretch py-4">
      <div className="relative flex justify-center items-center shrink-0 h-[480px]">
        {/* Background with faded right and left sides */}
        <div
          className="absolute inset-0 bg-[url(/src/assets/patterns/dot-grid.svg)] bg-top-9 bg-no-repeat w-full h-full z-0"
          style={{
            maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%) ',
            WebkitMaskImage: 'radial-gradient(circle at center, black 5%, transparent 100%)',
          }}
        />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 flex-0">
          <div className="flex flex-col items-center self-stretch gap-5">
            <div className="border-[1px] w-12 h-12 border-gray-960 border-solid flex justify-center items-center rounded-[12px] p-3 bg-white">
              {icon}
            </div>
            <div className="flex flex-col items-center self-stretch gap-2 w-352">
              <div className="text-center text-lg font-semibold text-gray-900 leading-7">
                {title}
              </div>
              <div className="text-gray-600 text-sm font-normal text-center leading-5">{desc}</div>
            </div>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
