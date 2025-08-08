import styled from "styled-components";
import GlossaryTableRow from "@/components/admin/glossary/GlossaryTableRow";
import type { GlossaryItem } from "@/store/glossaryStore";

interface GlossaryTableBodyProps {
  glossaryItems: GlossaryItem[];
  onArchive: (id: number) => void;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
  };
}

const GlossaryTableBody: React.FC<GlossaryTableBodyProps> = ({ 
  glossaryItems, 
  onArchive,
  modals
}) => {
  return (
    <TableBody>
      {glossaryItems.map((glossaryItem) => (
        <GlossaryTableRow 
          key={glossaryItem.documentId} 
          glossaryItem={glossaryItem} 
          onArchive={onArchive}
          modals={modals}
        />
      ))}
    </TableBody>
  );
};

export default GlossaryTableBody;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px 0;
`;
