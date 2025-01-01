import { mantine_tw_preset } from './src/shared/tailwind.mantine.preset';

const config = {
  presets: [mantine_tw_preset],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', ,],
  plugins: [],
  theme: {
    extend: {
      flex: {
        0: '1 0 0%',
      },
      backgroundImage: {
        'gradient-brand-90060045-deg': 'linear-gradient(45deg, #101323 0%, #3E4784 100%)',
        'gradient-brand-60050090-deg': 'linear-gradient(90deg, #4E5BA6 0%, #3E4784 100%)',
      },
      backgroundPosition: {
        'top-50': 'center -50.3%',
        'top-20': 'center -20rem',
        'top-19': 'center -19rem',
        'top-18': 'center -18rem',
        'top-16': 'center -16.9rem',
        'top-15': 'center -15rem',
        'top-11': 'center -11.9rem',
        'top-10': 'center -10.9rem',
        'top-12.8': 'center -12.8rem',
        'top-12.4': 'center -12.4rem',
        'top-9.5': 'center -9.5rem',
        'top-21.6': 'center -21.6rem',
        'top-10.2': 'center -10.2rem',
        'top-15.4': 'center -15.4rem',
         'top-sm-9': 'center -9rem'
      },
      backgroundSize: {
        75: '75%',
        83: '83%',
        68: '68%',
      },
      colors: {
        'Success-700': '#067647',
        'Brand-50': '#F8F9FC',
        'Brand-100': '#EAECF5',
        'Brand-700': '#363F72',
        'Gray-700': '#344054',
        'Gray-blue-300': '#B3B8DB',
        'Gray-200': '#EAECF0',
        'Success-600': '#079455',
        'Gray-600': '#475467',
        'Gray-500': '#667085',
        'Gray-50': '#F9FAFB',
        'Purple-200': '#D9D6FE',
        'Purple-50': '#F4F3FF',
        'Gray-300': '#D0D5DD',
        'Purple-700': '#5925DC',
        'Error-200': '#FECDCA',
        'Error-50': '#FEF3F2',
        'Error-700': '#B42318',
        'Blue-200': '#B2DDFF',
        'Blue-50': '#EFF8FF',
        'Brand-200': '#D5D9EB',
        'Blue-700': '#175CD3',
        'Indigo-200': '#C7D7FE',
        'Indigo-50': '#EEF4FF',
        'Indigo-700': '#3538CD',
        'Gray-900': '#101828',
        'Gray-blue-300': '#B3B8DB',
        'Success-50': '#ECFDF3',
        'Gray-100': '#F2F4F7',
        'Brand-600': '#3E4784',
        'Error-600': '#D92D20',
        'Error-100': '#FEE4E2',
        'Gray-blue-25': '#FCFCFD',
        'Warning-200': '#FEDF89',
        'Warning-50': '#FFFAEB',
        'Warning-700':'#B54708',
        'Error-300': '#FDA29B',
        'Gray-400': '#98A2B3',
        'Success-800': '#085D3A',
        'Brand-900': '#101323',
        'Brand-500': '#4E5BA6',
        'Success-200': '#ABEFC6'
      },
      boxShadow: {
        'custom-for-step-ring': '0px 0px 0px 1px rgba(158, 119, 237, 0.24)',
        'ring-brand-shadow-sm':
          '0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 0px 0px 4px rgba(158, 119, 237, 0.24);',
      },
      maxWidth: {
        'xs-1': '22.5rem',
        'xs-2': '21.875rem',
        'sm-4': '22rem'
      },
      width: {
        25: '6.25rem',
        35: '8.75rem',
        64.5: '16.5rem',
        'xs-1': '22.5rem',
        82: '21.9rem',
        352: '22rem',
        23: '14.5rem',
        3.2: '20rem',
        125: '7.833rem',
        182: '11.375rem',
        12.5: '7.188rem',
        5.6: '5.611rem',
        'md-1': '13.125rem',
        '5.5': '5.5rem',
        '11.5': '11.875rem',
        '7.8': '7.875rem',
        '17.5': '17.5rem',
        '18.75': '18.75rem',
        'sm_3': '30rem',
        'xs-2': '2.375rem',
        11.5: '11.875rem',
        7.8: '7.875rem',
      },
      height: {
        '35': '8.75rem',
        '13': "3.25",
        '25': '6.25rem',
        '2.57': '2.572rem',
        '176': '11rem',
        'md-54': '34.25rem',
        'sm-72': '4.5rem',
        'h-21': '5.25rem',
        5.8: '5.813rem',
        4.06: '4.063rem',
        xlg: '47.88rem',
        26.6: '17.5rem',
        'sm-1': '8.375rem',
        'sm-2': '7.125rem',
        'md-1': '37.5rem',
        '13.75': '13.75rem',
        '18.75': '18.75rem',
        '32.6': '32.625rem',
        'sm_3': '30rem',
        'xs-2': '2.375rem'
        
      },
      lineHeight: {
        9.5: '2.5rem',
        18: '1.125rem',
        38: '2.375rem',
        'xl-1': '1.875rem',
        30: '1.875rem',
        44: '2.75rem'
      },
      borderColor: {
        secondary: '#EAECF0',
      },
      spacing: {
        'sm-3': '0.188rem',
        'sm-9': '0.563rem',
        'md-1': '4.5rem',
        'sm-1': '3.375rem'
      },
      fontSize: {
        'xs-1': '0.688rem',
        'sm-1': '0.813rem',
      },
      gap: {
        'xs-1': '0.438rem',
        'xs-2': '0.313rem',
        '18': '1.125rem'
      },
      borderRadius: {
        'xl-1': '0.625rem',
        'xl-2': '1.75rem',
        xs: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'ring-brand-shadow-xs':
          '0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(158, 119, 237, 0.24)',
      },
      dropShadow: {
        'xs': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)', 
      }
    },
  },
};

export default config;
