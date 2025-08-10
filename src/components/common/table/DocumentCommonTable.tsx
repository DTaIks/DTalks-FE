import React, { useCallback } from "react";
import styled from "styled-components";
import DropDownButton from "@/components/common/DropDownButton";
import { useCommonHandlers } from "@/hooks/useCommonHandlers";
import ActiveIcon from "@/assets/common/Active.svg";
import InActiveIcon from "@/assets/common/InActive.svg";
import DocumentCategory1 from "@/assets/document/DocumentCategory1.svg";
import DocumentCategory2 from "@/assets/document/DocumentCategory2.svg";
import DocumentCategory3 from "@/assets/document/DocumentCategory3.svg";
import TableContainer from "@/components/common/table/TableContainer";
import TableHeader from "@/components/common/table/TableHeader";
import TableHead from "@/components/common/table/TableHead";
import TableBody from "@/components/common/table/TableBody";
import TableRow from "@/components/common/table/TableRow";
import TableCell from "@/components/common/table/TableCell";
import EmptyState from "@/components/common/EmptyState";
import type { DocumentItem } from "@/types/table";

interface DocumentTableProps {
  title: string;
  documents: DocumentItem[];
  searchTerm: string;
  selectedStatus: string;
  selectedCategory: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onArchive: (id: number) => void;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
  };
  error?: Error | null;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  title,
  documents,
  searchTerm,
  selectedStatus,
  selectedCategory,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onArchive,
  modals,
  error = null
}) => {
  const documentActions = { onArchive };
  const handlers = useCommonHandlers({ modals, documentActions });

  const handleDownload = useCallback((documentName: string) => {
    handlers.handleDownloadClick(documentName);
  }, [handlers]);

  const handleVersionManagement = useCallback((documentName: string) => {
    handlers.handleVersionManagementClick(documentName);
  }, [handlers]);

  const handleArchive = useCallback((documentName: string) => {
    handlers.handleArchiveClick(documentName);
  }, [handlers]);

  const headers = ["문서명", "카테고리", "버전", "작성자", "최종 수정일", "상태", "작업"];

  return (
    <TableContainer>
      <TableHeader
        title={title}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        selectedCategory={selectedCategory}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
      />
      {documents.length > 0 ? (
        <Table>
          <TableHead headers={headers} />
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.documentId}>
                <TableCell>
                  <DocumentName>{document.documentName}</DocumentName>
                </TableCell>
                <TableCell>
                  <CategoryImage 
                    src={document.category === "사내 정책" ? DocumentCategory2 : 
                         document.category === "용어 사전" ? DocumentCategory3 : 
                         DocumentCategory1} 
                    alt={document.category} 
                  />
                </TableCell>
                <TableCell>
                  <VersionText>{document.latestVersion}</VersionText>
                </TableCell>
                <TableCell>
                  <AuthorText>{document.uploaderName}</AuthorText>
                </TableCell>
                <TableCell>
                  <DateText>{document.lastUpdatedAt}</DateText>
                </TableCell>
                <TableCell>
                  <StatusIcon src={document.isActive ? ActiveIcon : InActiveIcon} alt={document.isActive ? "활성" : "비활성"} />
                </TableCell>
                <TableCell>
                  <DropDownButton 
                    items={[
                      { label: "다운로드", onClick: () => handleDownload(document.documentName) },
                      { label: "버전관리", onClick: () => handleVersionManagement(document.documentName) },
                      { label: "보관", onClick: () => handleArchive(document.documentName) },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState 
          message={error ? "문서 목록을 불러오는데 실패했습니다." : "표시할 문서가 없습니다"}
          subMessage={error ? "잠시 후 다시 시도해주세요." : "업로드된 문서가 없거나 필터 조건에 맞는 문서가 없습니다."}
        />
      )}
    </TableContainer>
  );
};

export default DocumentTable;

const Table = styled.div`
  width: 100%;
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
