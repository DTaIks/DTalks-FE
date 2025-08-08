import React from "react";
import styled from "styled-components";
import DropDownButton from "@/components/common/DropDownButton";
import type { Document } from "@/types/document";
import { useCommonHandlers } from "@/hooks/useCommonHandlers";

interface DocumentTableRowProps {
  document: Document;
  onArchive: (id: number) => void;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
  };
}

const DocumentTableRow: React.FC<DocumentTableRowProps> = ({ 
  document, 
  onArchive,
  modals
}) => {
  const documentActions = { onArchive };
  const handlers = useCommonHandlers({ modals, documentActions });

  const handleDownload = () => {
    handlers.handleDownloadClick(document.name);
  };

  const handleVersionManagement = () => {
    handlers.handleVersionManagementClick(document.name);
  };

  const handleArchive = () => {
    handlers.handleArchiveClick(document.name);
  };

  return (
    <TableRow>
      <TableCell>
        <DocumentName>{document.name}</DocumentName>
      </TableCell>
      <TableCell>
        <CategoryImage src={document.categoryImage} alt={document.category} />
      </TableCell>
      <TableCell>
        <VersionText>{document.version}</VersionText>
      </TableCell>
      <TableCell>
        <AuthorText>{document.author}</AuthorText>
      </TableCell>
      <TableCell>
        <DateText>{document.lastModified}</DateText>
      </TableCell>
      <TableCell>
        <StatusIcon src={document.statusIcon} alt={document.status} />
      </TableCell>
      <TableCell>
        <DropDownButton 
          items={[
            { label: "다운로드", onClick: handleDownload },
            { label: "버전관리", onClick: handleVersionManagement },
            { label: "보관", onClick: handleArchive },
          ]}
        />
      </TableCell>
    </TableRow>
  );
};

export default DocumentTableRow;

const TableRow = styled.div`
  width: 1062px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
  padding-left: 36px;
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #2D1457;
  font-size: var(--font-size-16);
  font-weight: 500;
  
  &:nth-child(1) { width: 200px; }
  &:nth-child(2) { width: 200px; justify-content: center; }
  &:nth-child(3) { width: 110px; }
  &:nth-child(4) { width: 110px; }
  &:nth-child(5) { width: 190px; }
  &:nth-child(6) { width: 110px; justify-content: center; }
  &:nth-child(7) { width: 110px; justify-content: center; }
`;

const DocumentName = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
`;

const CategoryImage = styled.img`
  width: 97.5px;
  height: 31.5px;
  object-fit: contain;
`;

const VersionText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
`;

const AuthorText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
`;

const DateText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
`;

const StatusIcon = styled.img`
  width: ${props => props.alt === "비활성" ? "69px" : "56px"};
  height: 32px;
  object-fit: contain;
`; 
