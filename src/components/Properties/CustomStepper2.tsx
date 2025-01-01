export function CustomStepper2({ steps }: any) {
  const activeStepIndex = 2;
  return (
    <ul className="relative flex flex-row list-none">
      {steps.map((step: any, index: number) => (
        <li key={index} className="shrink basis-0 flex-1 group">
          <div className="min-w-7 min-h-7 w-full inline-flex items-center text-xs align-middle">
            <span className="size-7 flex justify-center items-center flex-shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full dark:bg-neutral-700 dark:text-white">
              {index + 1}
            </span>
            <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
          </div>
          <div className="mt-3">
            <span className="block text-sm font-medium text-gray-800 dark:text-white">
              {step.label}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
