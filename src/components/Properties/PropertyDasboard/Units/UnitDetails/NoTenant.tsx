import { DotGridIcon, PlusIcon, Users01Icon } from "@assets/iconComponents";
import { Button, Card, CardSection } from "@mantine/core";

interface Props {
    title: string;
    type: string;
    btnTitle: string;
}
export function NoTenant({type,btnTitle,title}:Props){
return (
    <Card classNames={{
        root: 'flex flex-col h-13.75 justify-center rounded-[12px] items-center border-[1px] border-solid border-Gray-200 bg-white drop-shadow-xs self-stretch',
        section: 'relative'
    }}>
        <CardSection>
            <div className={`absolute w-18.75 h-18.75 ${type === 'past' ? 'left-[-50px] bottom-[-70px]' : 'left-[46px] bottom-[-46px]'}`}
            >
                <div className="flex w-18.75 h-18.75 justify-center items-center shrink-0">
                    <DotGridIcon />
                </div>
            </div>
            <div className="flex p-8 flex-col justify-center items-center gap-6 self-stretch z-10 relative">
                <div className="flex flex-col items-center gap-5 self-stretch">
                    <div className="flex w-12 h-12 p-3 items-center justify-center rounded-[10px] border-[1px] border-solid border-Gray-200 bg-white drop-shadow-xs">
                        <Users01Icon width={24} height={24} />
                    </div>
                    <span className="self-stretch text-Gray-900 text-center text-lg font-semibold leading-7">{title}</span>
                </div>
                {type !== 'past' && (
                    <div className="flex items-center gap-3">
                        <Button
                  classNames={{
                    section: 'w-5 h-5 m-0',
                    root: 'flex gap-1.5 py-2 px-3 justify-center rounded-[8px] shadow-xs text-base h-11',
                    inner: 'flex gap-1.5 justify-center shadow-xs text-base',
                  }}
                  className="bg-brand-960 hover:bg-brand-970 text-base font-semibold"
                  leftSection={<PlusIcon />}
                >
                  Add tenant
                </Button>

                <Button
                  size="md"
                  variant="outline"
                  className="bg-white text-sm text-[#363F72] text-base font-semibold rounded-[8px]"
                  leftSection={<PlusIcon />}
                >
                  {btnTitle}
                </Button>
                    </div>
                )}
            </div>
        </CardSection>
    </Card>
)
}