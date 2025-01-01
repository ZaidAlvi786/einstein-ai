import type { Config } from 'tailwindcss';

export const mantineTailwind: Config = {
  content: [],
  darkMode: ['class', '[data-mantine-color-scheme="dark"]'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      data: {
        checked: 'checked="true"',
        active: 'active="true"',
      },
      borderWidth: {
        1.5: '0.063rem',
        '3': '3px',
      },
      screens: {
        'mtn-xs': '576px', // 36em
        'mtn-sm': '768px', // 48em
        'mtn-md': '992px', // 62em
        'mtn-lg': '1200px', // 75em
        'mtn-xl': '1408px', // 88em
        1920: '1920px',
        1600: '1600px',
        1366: '1366px',
        1280: '1280px',
        1024: '1024px',
        768: '768px',
        480: '480px',
        375: '375px',
      },
      letterSpacing: {
        sm: '-0.045rem',
      },
      borderRadius: {
        lgMd: '0.625rem',
        xxxl: '1.75rem',
      },
      width: {
        34: '8.875rem',
      },
      margin: {
        97: '2.05rem',
        98: '2.188rem',
        6.2: '1.375rem',
        6.8: '1.625rem',
      },
      maxWidth: {
        xs: '22.5rem',
        mdSm: '30rem',
        lgSm: '27.5rem',
      },
      lineHeight: {
        'mtn-xs': 'var(--mantine-line-height-xs)',
        'mtn-sm': 'var(--mantine-line-height-sm)',
        'mtn-md': 'var(--mantine-line-height-md)',
        'mtn-lg': 'var(--mantine-line-height-lg)',
        'mtn-xl': 'var(--mantine-line-height-xl)',
        11: '1.125rem',
        12: '2.75rem',
        xxl: '1.875rem',
        xxxl: '2.375rem',
        'd-xl': '5.625rem',
        'lg-xl': '3.75rem',
      },
      padding: {
        15: '3.75rem',
        29: '7.25rem',
      },
      height: {
        17: '4.5rem',
        23:'5.625rem',
        30: '7.125rem',
        3.2: '1.375rem',
        22: '5.813rem',
        33:"8.5rem",
        37.5:"2.344rem",
        37.47:"2.342rem"
      },
      size: {
        4.5: '1.125rem',
      },
      fontSize: {
        xs: 'var(--mantine-font-size-xs)',
        sm: 'var(--mantine-font-size-sm)',
        md: 'var(--mantine-font-size-md)',
        lg: 'var(--mantine-font-size-lg)',
        xl: 'var(--mantine-font-size-xl)',
        h1: 'var(--mantine-h1-font-size)',
        h2: 'var(--mantine-h2-font-size)',
        h3: 'var(--mantine-h3-font-size)',
        h4: 'var(--mantine-h4-font-size)',
        h5: 'var(--mantine-h5-font-size)',
        h6: 'var(--mantine-h6-font-size)',
        'xs-regular': [
          '12px',
          {
            fontWeight: 400,
            lineHeight: '15px',
          },
        ],
        'xs-medium': [
          '12px',
          {
            fontWeight: 500,
            lineHeight: '18px',
          },
        ],
        'xs-semibold': [
          '12px',
          {
            fontWeight: 600,
            lineHeight: '18px',
          },
        ],
        'xs-bold': [
          '12px',
          {
            fontWeight: 700,
            lineHeight: '18px',
          },
        ],
        'sm-regular': [
          '14px',
          {
            fontWeight: 400,
            lineHeight: '20px',
          },
        ],
        'sm-medium': [
          '14px',
          {
            fontWeight: 500,
            lineHeight: '20px',
          },
        ],
        'sm-semibold': [
          '14px',
          {
            fontWeight: 600,
            lineHeight: '20px',
          },
        ],
        'sm-bold': [
          '14px',
          {
            fontWeight: 700,
            lineHeight: '20px',
          },
        ],
        'md-regular': [
          '16px',
          {
            fontWeight: 400,
            lineHeight: '24px',
          },
        ],
        'md-medium': [
          '16px',
          {
            fontWeight: 500,
            lineHeight: '24px',
          },
        ],
        'md-semibold': [
          '16px',
          {
            fontWeight: 600,
            lineHeight: '24px',
          },
        ],
        'md-bold': [
          '16px',
          {
            fontWeight: 700,
            lineHeight: '24px',
          },
        ],
        'lg-regular': [
          '18px',
          {
            fontWeight: 400,
            lineHeight: '28px',
          },
        ],
        'lg-medium': [
          '18px',
          {
            fontWeight: 500,
            lineHeight: '28px',
          },
        ],
        'lg-semibold': [
          '18px',
          {
            fontWeight: 600,
            lineHeight: '28px',
          },
        ],
        'lg-bold': [
          '18px',
          {
            fontWeight: 700,
            lineHeight: '28px',
          },
        ],
        'xl-regular': [
          '20px',
          {
            fontWeight: 400,
            lineHeight: '30px',
          },
        ],
        'xl-medium': [
          '20px',
          {
            fontWeight: 500,
            lineHeight: '30px',
          },
        ],
        'xl-semibold': [
          '20px',
          {
            fontWeight: 600,
            lineHeight: '30px',
          },
        ],
        'xl-bold': [
          '20px',
          {
            fontWeight: 700,
            lineHeight: '30px',
          },
        ],
        'd-xs-regular': [
          '1.5rem',
          {
            fontWeight: 400,
            lineHeight: '2rem',
          },
        ],
        'd-xs-medium': [
          '1.5rem',
          {
            fontWeight: 500,
            lineHeight: '2rem',
          },
        ],
        'd-xs-semibold': [
          '1.5rem',
          {
            fontWeight: 600,
            lineHeight: '2rem',
          },
        ],
        'd-xs-bold': [
          '1.5rem',
          {
            fontWeight: 700,
            lineHeight: '2rem',
          },
        ],
        'd-sm-regular': [
          '1.875rem',
          {
            fontWeight: 400,
            lineHeight: '2.375rem',
          },
        ],
        'd-sm-medium': [
          '1.875rem',
          {
            fontWeight: 500,
            lineHeight: '2.375rem',
          },
        ],
        'd-sm-semibold': [
          '1.875rem',
          {
            fontWeight: 600,
            lineHeight: '2.375rem',
          },
        ],
        'd-sm-bold': [
          '1.875rem',
          {
            fontWeight: 700,
            lineHeight: '2.375rem',
          },
        ],
        'd-md-regular': [
          '2.25rem',
          {
            fontWeight: 400,
            lineHeight: '2.75rem',
          },
        ],
        'd-md-medium': [
          '2.25rem',
          {
            fontWeight: 500,
            lineHeight: '2.75rem',
          },
        ],
        'd-md-semibold': [
          '2.25rem',
          {
            fontWeight: 600,
            lineHeight: '2.75rem',
          },
        ],
        'd-md-bold': [
          '2.25rem',
          {
            fontWeight: 700,
            lineHeight: '2.75rem',
          },
        ],
        'd-lg-regular': [
          '3rem',
          {
            fontWeight: 400,
            lineHeight: '3.75rem',
          },
        ],
        'd-lg-medium': [
          '3rem',
          {
            fontWeight: 500,
            lineHeight: '3.75rem',
          },
        ],
        'd-lg-semibold': [
          '3rem',
          {
            fontWeight: 600,
            lineHeight: '3.75rem',
          },
        ],
        'd-lg-bold': [
          '3rem',
          {
            fontWeight: 700,
            lineHeight: '3.75rem',
          },
        ],
        'd-xl-regular': [
          '3.75rem',
          {
            fontWeight: 400,
            lineHeight: '4.5rem',
          },
        ],
        'd-xl-medium': [
          '3.75rem',
          {
            fontWeight: 500,
            lineHeight: '4.5rem',
          },
        ],
        'd-xl-semibold': [
          '3.75rem',
          {
            fontWeight: 600,
            lineHeight: '4.5rem',
          },
        ],
        'd-xl-bold': [
          '3.75rem',
          {
            fontWeight: 700,
            lineHeight: '4.5rem',
          },
        ],
        'd-2xl-regular': [
          '4.5rem',
          {
            fontWeight: 400,
            lineHeight: '5.62rem',
          },
        ],
        'd-2xl-medium': [
          '4.5rem',
          {
            fontWeight: 500,
            lineHeight: '5.62rem',
          },
        ],
        'd-2xl-semibold': [
          '4.5rem',
          {
            fontWeight: 600,
            lineHeight: '5.62rem',
          },
        ],
        'd-2xl-bold': [
          '4.5rem',
          {
            fontWeight: 700,
            lineHeight: '5.62rem',
          },
        ],
        '4xl': [
          '2.25rem',
          {
            lineHeight: '2.75rem',
          },
        ],
        logo: [
          '20px',
          {
            fontWeight: 600,
            lineHeight: '24px',
          },
        ],
        tempBig: [
          '48px',
          {
            fontWeight: 600,
            lineHeight: '2.75rem',
          },
        ],
        tempCardTitle: [
          '32px',
          {
            fontWeight: 600,
            lineHeight: '2.75rem',
          },
        ],
        temp20: [
          '20px',
          {
            fontWeight: 600,
            lineHeight: '20px',
          },
        ],
      },
      spacing: {
        'mtn-xs': 'var(--mantine-spacing-xs)',
        'mtn-sm': 'var(--mantine-spacing-sm)',
        'mtn-md': 'var(--mantine-spacing-md)',
        'mtn-lg': 'var(--mantine-spacing-lg)',
        'mtn-xl': 'var(--mantine-spacing-xl)',
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      colors: {
        black: '#000000',
        red: 'red',
        gray: {
          25: '#FCFCFD',
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#FFF',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#182230',
          900: '#101828',
          950: '#0C111D',
          960: '#EAECF0',
        },
        brand: {
          25: '#FCFAFF',
          50: '#F9F5FF',
          75: '#FFF',
          100: '#F4EBFF',
          110: '#D5D9EB',
          120: '#EAECF5',
          200: '#E9D7FE',
          300: '#B3B8DB',
          400: '#B692F6',
          500: '#9E77ED',
          600: '#7F56D9',
          700: '#6941C6',
          800: '#53389E',
          900: '#42307D',
          940: '#4E5BA6',
          950: '#2C1C5F',
          960: '#363F72',
          970: '#3E4784',
        },
        success: {
          25: '#F6FEF9',
          50: '#ECFDF3',
          100: '#DCFAE6',
          200: '#ABEFC6',
          300: '#75E0A7',
          400: '#47CD89',
          500: '#17B26A',
          600: '#079455',
          700: '#067647',
          800: '#085D3A',
          900: '#074D31',
          950: '#053321',
        },
        error: {
          25: '#FFFBFA',
          50: '#FEF3F2',
          100: '#FEE4E2',
          200: '#FECDCA',
          300: '#FDA29B',
          400: '#F97066',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
          800: '#912018',
          900: '#7A271A',
          950: '#55160C',
        },
      },
      boxShadow: {
        error: '0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(240, 68, 56, 0.24)',
        test: '0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(158, 119, 237, 0.24)',
        'mtn-xs': 'var(--mantine-shadow-xs)',
        'mtn-sm': 'var(--mantine-shadow-sm)',
        'mtn-md': 'var(--mantine-shadow-md)',
        'mtn-lg': 'var(--mantine-shadow-lg)',
        'mtn-xl': 'var(--mantine-shadow-xl)',
        '2xl': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        input: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
      },
    },
  },
  plugins: [],
};

export { mantineTailwind as mantine_tw_preset };
