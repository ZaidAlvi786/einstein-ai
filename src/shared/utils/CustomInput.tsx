import { NumberInput, TextInput, TextInputProps } from '@mantine/core';
import React from 'react';
import clsx from 'clsx';
import AlertCircle from '@assets/iconComponents/AlertCircle';

interface Props extends TextInputProps {
  withIcons?: boolean;
  classNames?: any;
  // onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { withIcons,  ...otherProps } = props;

  // Ensure the value is of the correct type
  // const correctedValue: string | number | undefined = 
  //   typeof value === 'string' || typeof value === 'number' ? value : undefined;

  const commonProps = {
    ref,
    error: otherProps.error ? 'Something went wrong' : undefined,
    rightSection: otherProps.error ? <AlertCircle className={`size-4 text-error-500 ${props.type === 'number' ? 'me-2' : 'me-3.5'}`} /> : otherProps.rightSection,
    classNames: {
      input: clsx('pe-11') + ` !text-base	!font-normal py-2.5 ${!otherProps?.leftSection ? 'px-3.5' : '' }`,
      ...otherProps.classNames,
    },
    leftSection: otherProps.leftSection || null,
    // value: correctedValue,
    ...otherProps,
  };

  const handleChange = (value: number | undefined) => {
    if (props?.onChange) {
      // Create a synthetic native change event
      const syntheticEvent = {
        target: {
          value,
        } as any,
      } as React.ChangeEvent<HTMLInputElement>;

      props?.onChange(syntheticEvent);
    }
  };

  if ( props.type === 'number') {
    delete commonProps.type
    return <NumberInput {...{...commonProps, hideControls: true} as any } allowNegative = {false} onChange={handleChange} />;
  }

  return <TextInput {...commonProps} />;
});

export default CustomInput;















// import { TextInput, TextInputProps } from '@mantine/core';
// import React from 'react';
// import clsx from 'clsx';
// import AlertCircle from '@assets/iconComponents/AlertCircle';

// interface Props extends TextInputProps {
//   withIcons?: boolean;
//   classNames?: any
// }

// export const CustomInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
//   const { withIcons, ...otherProps } = props;

//   if (props.withIcons) {
//     return (
//       <TextInput
//         ref={ref}
//         error={otherProps.error && 'Something went wrong'}
//         rightSection={
//           otherProps.error ? <AlertCircle className="size-4 text-error-500 me-3.5" /> : otherProps.rightSection
//         }
//         classNames={{
//           input: clsx('pe-11'),
//           ...otherProps.classNames
//         }}
//         leftSection={otherProps.leftSection ? otherProps.leftSection : null}
//         {...otherProps}
//       />
//     );
//   }
//   return (
//     <TextInput
//       ref={ref}
//       rightSection={
//         props.error ? <AlertCircle className="size-4 text-error-500 me-3.5" /> : null
//       }
//       {...props}
//     />
//   );
// });
