import styled from "styled-components";
import DocumentTableRow from "@/components/admin/document/DocumentTableRow";
import type { Document } from "@/types/document";

interface DocumentTableBodyProps {
  documents: Document[];
  onArchive: (id: number) => void;
}

const DocumentTableBody: React.FC<DocumentTableBodyProps> = ({ documents, onArchive }) => {
  return (
    <TableBody>
      {documents.map((document) => (
        <DocumentTableRow 
          key={document.id} 
          document={document} 
          onArchive={onArchive}
        />
      ))}
    </TableBody>
  );
};

export default DocumentTableBody;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px 0;
`; 