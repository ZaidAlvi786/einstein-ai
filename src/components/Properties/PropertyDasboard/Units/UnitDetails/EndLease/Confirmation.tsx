import { Button } from "@mantine/core";
interface Props {
    setEndLeaseModalModalOpen: (item: boolean) => void;
    handlers: {
        increment: () => void;
        decrement: () => void;
        set: (value: number) => void;
      };
      setModalSize: (item: string) => void;
  }
export function Confirmation({setEndLeaseModalModalOpen,handlers,setModalSize}: Props) { 
    const onSubmit = ()=>{
        setEndLeaseModalModalOpen(false);
        handlers.set(0)
        setModalSize('lg')
    }
    return (
        <div className="flex pt-0 pt-8 pb-6 px-6 items-start gap-3 self-stretch">
        <Button
          size="md"
          variant="outline"
          className="bg-white w-1/2 border-gray-300 text-gray-700 text-base font-semibold rounded-lg"
          classNames={{ label: 'text-gray-700' }}
          onClick={()=>{handlers.decrement(), setModalSize('lg')}}
        >
          Cancel
        </Button>
        <Button
                        size="md"
                        className="bg-Error-600 w-1/2 hover:bg-Error-600 text-base font-semibold rounded-lg"
                       onClick={onSubmit}
                    >
                        Confirm
                    </Button>
      </div>
    )
}