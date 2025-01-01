interface Props {
    tenantStatus:string;
}
export function TenantStatus({tenantStatus}:Props){
    return (
        <div className="flex py-2 w-full flex-col items-center gap-2 rounded-[8px] border-[1px] border-solid border-Gray-200 bg-Gray-100 drop-shadow-xs">
            <span className="text-Gray-600 text-center text-sm font-medium leading-5">{tenantStatus}</span>
        </div>
    );
}