import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DocumentViewer = ({ documentUrl }) => {
  const [visible, setVisible] = useState(false);
  const [ClientViewer, setClientViewer] = useState(null);

  useEffect(() => {
    // Load the viewer dynamically when running on the client side
    if (typeof window !== 'undefined') {
      const dynamicViewer = dynamic(() => import('react-viewer'), {
        ssr: false, // This ensures the component isn't rendered on the server
      });

      setClientViewer(dynamicViewer);
    }
  }, []);

  return (
    <div>
      <button onClick={() => setVisible(true)}>Open Document</button>

      {ClientViewer && (
        <ClientViewer
          visible={visible}
          onClose={() => setVisible(false)}
          images={[{ src: "https://firebasestorage.googleapis.com/v0/b/cresthive-88396.appspot.com/o/documents%2F3I8XM7SQ0B8N6ZNjbOeA?alt=media&token=ec6610f8-6d73-4bee-aa94-a156ee2dfd23", alt: 'Document' }]}
          noNavbar
        />
      )}
    </div>
  );
};

export default DocumentViewer;
