import React from 'react';
import { Document, Page, PDFViewer } from '@react-pdf/renderer';
import ReportCardPage from './ReportCardPage'; // Import your original component

const PDFReportCard = () => {
  return (
    <Document>
      <Page size="A4">
        <ReportCardPage />
      </Page>
    </Document>
  );
};

export default PDFReportCard;
