// import type { ReactNode } from "react";
// import { Layout as RALayout, CheckForApplicationUpdate } from "react-admin";

// export const Layout = ({ children }: { children: ReactNode }) => (
//   <RALayout>
//     {children}
//     <CheckForApplicationUpdate />
//   </RALayout>
// );

// in src/MyLayout.js
import { Layout as RALayout, CheckForApplicationUpdate } from "react-admin";
import { AppBar } from "../CustomComponents/AppBar";
import { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout appBar={AppBar}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);
