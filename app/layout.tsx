import { StyledRegistry } from "../styles/styled-registry";
import { Inter } from "next/font/google";
import "prosemirror-example-setup/style/style.css";
import "prosemirror-view/style/prosemirror.css";

import "./globals.css";
import StyledJsxRegistry from "./registry";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://prosemirror.net/css/editor.css" />
      </head>
      <body className={inter.className}>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
