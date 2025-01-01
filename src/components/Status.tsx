import clsx from 'clsx';

interface Status {
  text: string;
  value: string;
  variant: 'success' | 'error' | 'neutral' | 'inprogress' | 'schedueled';
}

const statuses: Status[] = [
  { text: 'Guaranteed', value: 'Guaranteed', variant: 'success' },
  { text: 'Vacant', value: 'vacant', variant: 'success' },
  { text: 'Applied', value: 'applied', variant: 'success' },
  { text: 'In Progress', value: 'inProgress', variant: 'success' },
  { text: 'Rejected', value: 'rejected', variant: 'error' },
  { text: 'Cancelled', value: 'cancelled', variant: 'error' },
  { text: 'Expired', value: 'expired', variant: 'error' },
  { text: 'Disqualified', value: 'Disqualified', variant: 'error' },
  { text: 'Pre-Qualified', value: 'Pre-Qualified', variant: 'neutral' },
  { text: 'Qualified', value: 'Qualified', variant: 'neutral' },
  { text: 'Approved', value: 'Approved', variant: 'neutral' },
  { text: 'NA', value: 'NA', variant: 'inprogress' },
  { text: 'Pending', value: 'Pending', variant: 'inprogress' },
  { text: 'Schedueled', value: 'Schedueled', variant: 'schedueled' },
  { text: 'Screening...', value: 'Screening...', variant: 'inprogress' },
  { text: 'Cancelled', value: 'Cancelled', variant: 'inprogress' },
  { text: 'Accepted', value: 'Accepted', variant: 'neutral' },
  { text: '294', value: 'Number', variant: 'neutral' },
  { text: 'Current', value: 'Current', variant: 'success' },
  { text: 'Paid', value: 'Paid', variant: 'success' },
  { text: 'Individual', value: 'Individual', variant: 'inprogress' },
];

const getClassNameByStatus = (status?: Status, tab?: string) => {
  const variant = status?.variant;
  if (tab === 'application') {
    // Add your specific logic for "application" tab here, or return a default class
    if (variant === 'success') return 'bg-Success-50 border-Success-200 text-Success-700';
    if (variant === 'error') return 'bg-Error-50 border-Error-200 text-Error-700';
    if (variant === 'neutral' && status?.text !== 'Qualified')
      return 'bg-Indigo-50 border-Indigo-200 text-Indigo-700';
    if (variant === 'schedueled') return 'bg-Bran-50 border-Brand-200 text-Brand-700';
    if (variant === 'neutral' && status?.text === 'Qualified')
      return 'bg-Success-50 border-Success-200 text-Success-700';
    if (variant === 'inprogress') return 'bg-Gray-50 border-Gray-200 text-Gray-700';
  } else {
    if (variant === 'success') return 'bg-Success-50 border-Success-200 text-Success-700';
    if (variant === 'error') return 'bg-Error-50 border-Error-200 text-Error-700';
    if (variant === 'neutral') return 'bg-Indigo-50 border-Indigo-200 text-Indigo-700';
    return 'bg-Gray-50 border-Gray-200 text-Gray-700';
  }
};

export interface Props {
  statusValue: any;
  tab: string;
}

export function Status({ statusValue, tab }: Props) {
  const status = statuses.find((item) => item.value === statusValue);
  const statusText = status?.text ?? 'Unknown status';
  const statusClassName = getClassNameByStatus(status, tab);

  return (
    <div
      className={clsx(
        statusClassName,
        'flex items-center gap-1 border border-solid w-fit px-1.5 py-0.5 rounded-md'
      )}
    >
      <span className="text-xs font-medium leading-18 text-center ">{statusText}</span>
    </div>
  );
}
