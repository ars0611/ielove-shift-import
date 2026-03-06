import { useState } from 'react';
import { AccountLinkSection } from '@/components/sections/accountLinkSection';
import { LoadSheetSection } from '@/components/sections/loadSheetSection';
import type { SheetData } from '@/types/sheet';
import './App.css';

export default function App() {
  return (
    <div className="p-4">
      <AccountLinkSection />
      <LoadSheetSection />
    </div>
  );
}
