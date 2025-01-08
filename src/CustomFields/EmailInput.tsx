// import React, { useState, useEffect, useRef } from 'react';
// import { TextInputProps, useInput, useNotify } from 'react-admin';
// import clsx from 'clsx';
// import { styled } from '@mui/material/styles';
// import {
//   ResettableTextField,
//   FieldTitle,
//   InputHelperText,
//   sanitizeInputRestProps,
// } from 'react-admin';
// import './styles.css'; // Ensure you import the CSS file

// const StyledTextField = styled(ResettableTextField)(({ theme, error }) => ({
//   '& .MuiInputBase-root': {
//     borderColor: error ? theme.palette.error.main : 'inherit',
//   },
//   '& .MuiInputBase-input::placeholder': {
//     color: error ? theme.palette.error.main : 'inherit',
//     transition: 'color 0.5s',
//   },
// }));

// const ValidationInput = (props: TextInputProps) => {
//   const {
//     className,
//     defaultValue,
//     label,
//     format,
//     helperText,
//     onBlur,
//     onChange,
//     parse,
//     resource,
//     source,
//     validate,
//     ...rest
//   } = props;

//   const {
//     field,
//     fieldState: { error, invalid },
//     id,
//     isRequired,
//   } = useInput({
//     defaultValue,
//     format,
//     parse,
//     resource,
//     source,
//     type: 'text',
//     validate,
//     onBlur,
//     onChange,
//     ...rest,
//   });

//   const notify = useNotify();
//   const [value, setValue] = useState(field.value || '');
//   const [typing, setTyping] = useState(false);
//   const [labelShake, setLabelShake] = useState(false);
//   const [validateError, setValidateError] = useState<FieldError | null>(null);
//   const typingInterval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds
//   const inputRef = useRef<HTMLInputElement>();

//   useEffect(() => {
//     const validateInput = async () => {
//       const result = await serverValidator(value, `validate/${source}`);
//       setValidateError(result);
//       if (result?.error) {
//         notify(result.message, { type: 'warning' });
//         setLabelShake(true);
//         setTimeout(() => setLabelShake(false), 500);
//       }
//     };

//     if (typing) {
//       const timer = setTimeout(() => {
//         setTyping(false);
//         validateInput();
//       }, typingInterval);
//       return () => clearTimeout(timer);
//     }
//   }, [typing, value, source, notify, typingInterval]);

//   useEffect(() => {
//     setValue(field.value || '');
//     setValidateError(null); // Reset validation error on reset
//   }, [field.value]);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(event.target.value);
//     setTyping(true);
//     if (onChange) {
//       onChange(event);
//     }
//   };

//   const handleReset = () => {
//     setValue('');
//     setValidateError(null);
//     setTyping(false);
//     if (onChange) {
//       onChange({ target: { value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>);
//     }
//   };

//   const renderHelperText = helperText !== false || invalid;
//   const isError = validateError?.error || invalid;

//   return (
//     <StyledTextField
//       id={id}
//       {...field}
//       value={value}
//       onChange={handleChange}
//       resettable
//       onClickClearButton={handleReset}
//       className={clsx('ra-input', `ra-input-${source}`, className)}
//       InputLabelProps={{
//         className: clsx({ 'label-shake': labelShake }),
//       }}
//       label={
//         label !== '' && label !== false ? (
//           <FieldTitle label={label} source={source} isRequired={isRequired} />
//         ) : null
//       }
//       resource={resource}
//       error={isError}
//       helperText={
//         renderHelperText ? (
//           <InputHelperText
//             error={validateError?.message || error?.message}
//             helperText={helperText}
//           />
//         ) : null
//       }
//       {...sanitizeInputRestProps(rest)}
//       inputRef={inputRef}
//     />
//   );
// };

// export default ValidationInput;
