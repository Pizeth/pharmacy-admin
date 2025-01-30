import {
  Create,
  ImageField,
  ImageInput,
  maxLength,
  minLength,
  NumberInput,
  regex,
  required,
  SelectInput,
  SimpleForm,
} from "react-admin";
import { InputAdornment } from "@mui/material";
import ValidationInput from "./CustomFields/LiveValidationInput";
import { FormSpy } from "react-final-form";
import {
  PermIdentity,
  MailOutline,
  Password,
  PeopleAltRounded,
} from "@mui/icons-material";
import { useState } from "react";
import PasswordValidationInput from "./fortest";
// import PasswordValidationInput from "./CustomFields/PasswordValidationInput";

const choices = [
  { id: "SUPER_ADMIN", name: "Super Admin", disabled: true },
  { id: "ADMIN", name: "Admin" },
  { id: "MANAGER", name: "Manager" },
  { id: "CASHIER", name: "Cashier" },
  { id: "USER", name: "User" },
];

const validateUsername = [
  required("Username can't be empty!"),
  minLength(5, "Username must be at least 5 characters long!"),
  maxLength(20, "Username can't be exceed 20 characters!"),
  regex(
    "^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$",
    "Username must contain only alpha numeric, . and _",
  ),
];

// const RePasswordInput = (props: { source: string; required: boolean }) => {
//   const { values } = useFormState();
//   const validateRePassword = useMemo(
//     () => (value: string) => {
//       return value === values.password
//         ? undefined
//         : "The passwords do not match.";
//     },
//     [values.password],
//   );
//   return <ValidationInput {...props} validate={validateRePassword} />;
// };

const RePasswordInput = (props: { source: string; required: boolean }) => {
  return (
    <FormSpy subscription={{ values: true }}>
      {({ values }: { values: { password: string } }) => {
        const validate = (value: string) => {
          return value === values.password
            ? undefined
            : "The passwords do not match.";
        };
        return <ValidationInput {...props} validate={validate} />;
      }}
    </FormSpy>
  );
};

// const RePasswordInput = ({ validate, ...props }) => {
//   const { values } = useFormState();
//   const enhancedValidate = (value: any) => {
//     return validate ? validate(value, values) : undefined;
//   };
//   return <ValidationInput source={""} {...props} validate={enhancedValidate} />;
// };

// const RePasswordInput = (props: any) => {
//   const { values } = useFormState();
//   return (
//     <ValidationInput
//       {...props}
//       validate={(value) => equalToPassword(value, values)}
//     />
//   );
// };

// interface RePasswordInputProps {
//   source: string;
//   validate?: (value: string) => string | undefined;
//   required?: boolean;
// }

// const RePasswordInput: React.FC<RePasswordInputProps> = (props) => {
//   const { values } = useFormState();
//   const validate = (value: string) => {
//     return value === values.password
//       ? undefined
//       : "The passwords do not match.";
//   };
//   return <ValidationInput {...props} validate={validate} />;
// };

// const equalToPassword = (value: string, allValues: Record<string, any>) => {
//   return value === allValues.password
//     ? undefined
//     : "The passwords do not match.";
// };

// const equalToPassword = (value: string, allValues: { password: string }) => {
//   if (value !== allValues.password) {
//     return "The two passwords must match!";
//   }
// };

export const UserCreate = () => {
  type FocusedField = "rePassword" | "role" | null;
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState("");
  // const [focused, setFocused] = useState(false);
  const [focused, setFocused] = useState<FocusedField>(null);

  // const handleFocus = () => setFocused(true);
  const handleFocus = (field: FocusedField) => setFocused(field);
  // const handleBlur = () => setFocused(false);
  const handleBlur = () => setFocused(null);

  return (
    <Create>
      <SimpleForm>
        <ValidationInput
          source="username"
          resettable
          className="icon-input"
          iconStart={<PermIdentity />}
          required
        />
        {/* <TextInput source="username" /> */}
        {/* <TextInput source="email" type="email" /> */}
        <ValidationInput
          source="email"
          resettable
          className="icon-input"
          iconStart={<MailOutline />}
          type="email"
          required
        />
        {/* <PasswordInputMeter
          source="password"
          iconStart={<Password />}
          className="icon-input"
          // onChangeCapture={(e) =>
          //   setPassword((e.target as HTMLInputElement).value)
          // }
          onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          // onChange={(e) => setPassword(e.target.value)}
          required
        /> */}
        <PasswordValidationInput
          source="password"
          iconStart={<Password />}
          className="icon-input"
          strengthMeter
          onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          required
        />
        <PasswordValidationInput
          source="rePassword"
          passwordValue={password}
          iconStart={<Password />}
          className="icon-input"
          required
        />
        {/* <RepasswordInput
          source="rePassword"
          passwordValue={password}
          iconStart={<Password />}
          className="icon-input"
          required
        /> */}
        {/* <PasswordInput
          source="rePassword"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Password />
              </InputAdornment>
            ),
          }}
          className="icon-input"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          // onFocus={handleFocus}
          onFocus={() => handleFocus("rePassword")}
          onBlur={handleBlur}
          required
          InputLabelProps={{
            shrink: rePassword !== "" || focused === "rePassword",
          }}
        /> */}
        {/* <RePasswordInput source="rePassword" required /> */}
        <ImageInput
          source="file"
          label="Avatar"
          accept={{ "image/*": [".png", ".jpg"] }}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
        <SelectInput
          source="role"
          choices={choices}
          emptyText="No role selected"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PeopleAltRounded />
              </InputAdornment>
            ),
          }}
          className="icon-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          // onFocus={handleFocus}
          onFocus={() => handleFocus("role")}
          onBlur={handleBlur}
          required
          InputLabelProps={{
            shrink: role !== "" || focused === "role",
          }}
        />
        <NumberInput source="createdBy" />
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;

// export const UserCreate = () => (
//   <Create>
//     <Form>
//       <Grid container>
//         <Grid item xs={6}>
//           <ValidationInput source="username" resettable required />
//         </Grid>
//         <Grid item xs={6}>
//           <ValidationInput source="email" resettable required type="email" />
//         </Grid>
//         <Grid item xs={6}>
//           <PasswordInputMeter source="password" required />
//         </Grid>
//         <Grid item xs={6}>
//           <PasswordInput source="rePassword" required />
//         </Grid>
//         <Grid item xs={12}>
//           <ImageInput
//             source="file"
//             label="Avatar"
//             accept={{ "image/*": [".png", ".jpg"] }}
//           >
//             <ImageField source="src" title="title" />
//           </ImageInput>
//         </Grid>
//         <Grid item xs={12}>
//           <SaveButton />
//         </Grid>
//       </Grid>
//     </Form>
//   </Create>
// );

// export const UserCreate = () => (
//   <Create>
//     <Form>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           backgroundColor: "#333",
//           padding: "15px",
//         }}
//       >
//         <Grid container spacing={1}>
//           <Grid item xs={12}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={3}>
//                 <ValidationInput source="username" resettable required />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <ValidationInput
//                   source="email"
//                   resettable
//                   required
//                   type="email"
//                 />
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={3}>
//                 <PasswordInputMeter source="password" required />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <PasswordInput source="rePassword" required />
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <ImageInput
//               source="file"
//               label="Avatar"
//               accept={{ "image/*": [".png", ".jpg"] }}
//             >
//               <ImageField source="src" title="title" />
//             </ImageInput>
//           </Grid>
//         </Grid>
//         <Toolbar>
//           <Button variant="contained" color="secondary" label="Cancel"></Button>
//           <SaveButton />
//         </Toolbar>
//       </Box>
//     </Form>
//   </Create>
// );

// src/components/RentalCreate.js
// import React, { useState, useEffect } from 'react';
// import {
//   Create,
//   SimpleForm,
//   DateTimeInput,
//   SelectInput,
//   useNotify,
//   useRefresh,
//   useRedirect,
//   useQuery,
//   TextInput,
// } from 'react-admin';

// const RentalCreate = (props) => {
//   const notify = useNotify();
//   const refresh = useRefresh();
//   const redirect = useRedirect();

//   const onSuccess = ({ data }) => {
//     notify(`New User created `);
//     redirect(`/rentals?filter=%7B"id"%3A"${data.id}"%7D`);
//     refresh();
//   };

//   const [customers, setCustomers] = useState([]);
//   const { data: customer } = useQuery({
//     type: 'getList',
//     resource: 'customers',
//     payload: {
//       pagination: { page: 1, perPage: 600 },
//       sort: { field: 'email', order: 'ASC' },
//       filter: {},
//     },
//   });

//   const [films, setFilms] = useState([]);
//   const { data: film } = useQuery({
//     type: 'getList',
//     resource: 'films',
//     payload: {
//       pagination: { page: 1, perPage: 1000 },
//       sort: { field: 'title', order: 'ASC' },
//       filter: {},
//     },
//   });

//   useEffect(() => {
//     if (film) setFilms(film.map((d) => ({ id: d.title, name: d.title })));
//     if (customer)
//       setCustomers(customer.map((d) => ({ id: d.email, name: d.email })));
//   }, [film, customer]);

//   return (
//     <Create {...props} title='Create new Rental' onSuccess={onSuccess}>
//       <SimpleForm>
//         <TextInput disabled source='staff_id' defaultValue='1' />
//         <SelectInput source='customer_email' choices={customers} />
//         <SelectInput source='film_title' choices={films} />
//         <SelectInput
//           source='status'
//           defaultValue='borrowed'
//           disabled
//           choices={[
//             { id: 'borrowed', name: 'borrowed' },
//             { id: 'delayed', name: 'delayed' },
//             { id: 'lost', name: 'lost' },
//             { id: 'returned', name: 'returned' },
//           ]}
//         />

//         <DateTimeInput source='rental_date' />

//         <DateTimeInput source='return_date' />
//       </SimpleForm>
//     </Create>
//   );
// };

// export default RentalCreate;
