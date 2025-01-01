import { FileDownload03Icon, PrinterIcon } from '@assets/iconComponents';
import { Box, Button, Group, Stack, Text } from '@mantine/core';
interface Props {
  type: string | undefined;
}
const ScreeningPanelDataCardView = ({ type }: Props) => {
  return (
    <Box className="flex flex-col gap-4 w-full p-8 bg-white border-[1px] border-solid border-brand-300 shadow-[0px_0px_0px_4px_rgba(158,119,237,0.24),_0px_1px_2px_0px_rgba(16,24,40,0.06),_0px_1px_3px_0px_rgba(16,24,40,0.1)]">
      <Box className="rounded-[12px] border-[1px] border-solid border-Gray-200 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
        <Box className="flex justify-between border-b-[1px] border-solid border-Gray-200 p-6 pb-4 font-medium ">
          <Box className={`flex flex-col ${type === 'lease' ? 'justify-between' : 'gap-6'}`}>
            <Box className="flex gap-2 items-center">
              <Text className="font-semibold text-xl leading-30 text-Gray-700">
                Current Address
              </Text>
              <Box className="rounded-[6px] border-[1px] border-solid border-Brand-200 py-0.5 px-1.5 bg-Gray-50">
                <Text className="font-medium text-xs leading-18">Tenant</Text>
              </Box>
            </Box>
            <Box className="flex flex-col gap-1">
              <Text className="text-sm leading-5 text-Gray-600">123 Main St. Unit 101</Text>
              <Text className="text-sm leading-5 text-Gray-600">New York, NY 11211</Text>
            </Box>
            <Box className="flex flex-col gap-1">
              <Text className="text-sm leading-5 text-Gray-900 font-semibold">
                Reason for moving
              </Text>
              <Text className="text-sm leading-5 text-Gray-600">No reason given</Text>
            </Box>
          </Box>
          <Box className={`flex flex-col justify-between ${type === 'lease' && 'gap-8'}`}>
            <Box className="rounded-[6px] border border-solid border-Brand-200 py-0.5 px-1.5 bg-Gray-50">
              <Text className="font-medium text-sm leading-18">Self reported - unverified</Text>
            </Box>
            <Box className="text-right">
              <Text className="text-sm leading-5 text-Gray-900 font-semibold">
                Landlord reference
              </Text>
              <Text className="text-sm leading-5 text-Gray-600">John Sansor</Text>
              <Text className="text-sm leading-5 text-Gray-600">212-212-2211</Text>
              <Text className="text-sm leading-5 text-Gray-600">john@email.com</Text>
            </Box>
          </Box>
        </Box>
        <Box className="py-4 px-6 flex justify-between items-center">
          <Text
            className={`font-semibold text-Brand-700 ${type === 'lease' && 'text-sm leading-5'}`}
          >
            March 2022 - Present
          </Text>
          <Box className="flex items-center gap-4">
            <Box className="flex gap-2 items-center">
              <PrinterIcon height={20} width={20} />
              <Text
                className={`font-semibold text-Brand-700 ${type === 'lease' && 'text-sm leading-5'}`}
              >
                Print
              </Text>
            </Box>
            <Box className="flex gap-2 items-center">
              <FileDownload03Icon height={20} width={20} />
              <Text
                className={`font-semibold text-Brand-700 ${type === 'lease' && 'text-sm leading-5'}`}
              >
                Download
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="rounded-[12px] border-[1px] border-solid border-Gray-200 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
        <Box className="flex justify-between border-b-[1px] border-solid border-Gray-200 p-6 pb-4 font-medium ">
          <Box className={`flex flex-col ${type === 'lease' ? 'justify-between' : 'gap-6'}`}>
            <Box className="flex gap-2 items-center">
              <Text className="font-semibold text-xl leading-30 text-Gray-700">
                Priveues address 1
              </Text>
              <Box className="rounded-[6px] border-[1px] border-solid border-Brand-200 py-0.5 px-1.5 bg-Gray-50">
                <Text className="font-medium text-xs leading-18">Living with parents</Text>
              </Box>
            </Box>
            <Box className="flex flex-col gap-1">
              <Text className="text-sm leading-5 text-Gray-600">123 Main St. Unit 101</Text>
              <Text className="text-sm leading-5 text-Gray-600">New York, NY 11211</Text>
            </Box>
            <Box className="flex flex-col gap-1">
              <Text className="text-sm leading-5 text-Gray-900 font-semibold">
                Reason for moving
              </Text>
              <Text className="text-sm leading-5 text-Gray-600">No reason given</Text>
            </Box>
          </Box>
          <Box className={`flex flex-col justify-between ${type === 'lease' && 'gap-8'}`}>
            <Box className="rounded-[6px] border-[1px] border-solid border-Brand-200 py-0.5 px-1.5 bg-Gray-50">
              <Text className="font-medium text-xs leading-18">Self reported - unverified</Text>
            </Box>
          </Box>
        </Box>
        <Box className="py-4 px-6 flex justify-between items-center">
          <Text className={`font-semibold text-Brand-700 ${type === 'lease' && 'text-sm leading-5'}`}>March 2022 - Present</Text>
          <Box className="flex items-center gap-4">
            <Box className="flex gap-2 items-center">
              <PrinterIcon height={20} width={20} />
              <Text className={`font-semibold text-Brand-700 ${type === 'lease' && 'text-sm leading-5'}`}>Print</Text>
            </Box>
            <Box className="flex gap-2 items-center">
              <FileDownload03Icon height={20} width={20} />
              <Text className={`font-semibold text-Brand-700 ${type === 'lease' && 'text-sm leading-5'}`}>Download</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ScreeningPanelDataCardView;
