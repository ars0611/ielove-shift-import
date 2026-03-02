import { useState } from 'react';
import { AccountLinkSection } from '@/components/sections/accountLinkSection';
import { LoadSheetSection } from '@/components/sections/loadSheetSection';
import type { SheetData } from '@/types/sheet';
import './App.css';
import { ImportToCalendarSection } from '@/components/sections/importToCalendarSection';

export default function App() {
  const [sheetData, setSheetData] = useState<SheetData>([[]]);
  return (
    <div className="p-4">
      <AccountLinkSection />
      <LoadSheetSection sheetData={sheetData} setSheetData={setSheetData} />
      <ImportToCalendarSection sheetData={sheetData}/>
    </div>
  );
}
