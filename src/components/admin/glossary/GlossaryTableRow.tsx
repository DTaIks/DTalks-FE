import React from "react";
import styled from "styled-components";
import DropDownButton from "@/components/common/DropDownButton";
import type { GlossaryItem } from "@/store/glossaryStore";
import { useCommonHandlers } from "@/hooks/useCommonHandlers";
import DocumentCategory1 from "@/assets/document/DocumentCategory1.svg";
import ActiveIcon from "@/assets/common/Active.svg";
import InActiveIcon from "@/assets/common/InActive.svg";

interface GlossaryTableRowProps {
  glossaryItem: GlossaryItem;
  onArchive: (id: number) => void;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
  };
}

const GlossaryTableRow: React.FC<GlossaryTableRowProps> = ({ 
  glossaryItem, 
  onArchive,
  modals
}) => {
  const documentActions = { onArchive };
  const handlers = useCommonHandlers({ modals, documentActions });

  const handleDownload = () => {
    handlers.handleDownloadClick(glossaryItem.documentName);
  };

  const handleVersionManagement = () => {
    handlers.handleVersionManagementClick(glossaryItem.documentName);
  };

  const handleArchive = () => {
    handlers.handleArchiveClick(glossaryItem.documentName);
  };

  return (
    <TableRow>
      <TableCell>
        <DocumentName>{glossaryItem.documentName}</DocumentName>
      </TableCell>
      <TableCell>
        <CategoryImage src={DocumentCategory1} alt={glossaryItem.category} />
      </TableCell>
      <TableCell>
        <VersionText>{glossaryItem.latestVersion}</VersionText>
      </TableCell>
      <TableCell>
        <AuthorText>{glossaryItem.uploaderName}</AuthorText>
      </TableCell>
      <TableCell>
        <DateText>{glossaryItem.lastUpdatedAt}</DateText>
      </TableCell>
      <TableCell>
        <StatusIcon src={glossaryItem.isActive ? ActiveIcon : InActiveIcon} alt={glossaryItem.isActive ? "활성" : "비활성"} />
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

export default GlossaryTableRow;

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
