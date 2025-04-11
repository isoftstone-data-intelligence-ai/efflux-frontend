import { ThemeProvider } from 'next-themes';
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';


export default function(props) {
  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {props.children}
    </ThemeProvider>
  );
}