import React, { useCallback } from "react";
import styled from "styled-components";
import DropDownButton from "@/components/common/DropDownButton";
import { useCommonHandlers } from "@/hooks/useCommonHandlers";
import ActiveIcon from "@/assets/common/Active.svg";
import InActiveIcon from "@/assets/common/InActive.svg";
import TableContainer from "./TableContainer";
import TableHeader from "./TableHeader";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import TableRow from "./TableRow";
import TableCell from "./TableCell";
import EmptyState from "@/components/common/EmptyState";
import type { DocumentItem } from "@/types/table";

interface CommonTableProps {
  title: string;
  items: DocumentItem[];
  searchTerm: string;
  selectedStatus: string;
  selectedCategory?: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onArchive: (id: number) => void;
  categoryImage: string;
  isLoading?: boolean;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
    handleVersionHistoryClick?: (fileName: string) => void;
  };
}

const CommonTable: React.FC<CommonTableProps> = ({
  title,
  items,
  searchTerm,
  selectedStatus,
  selectedCategory,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onArchive,
  categoryImage,
  isLoading = false,
  modals
}) => {
  const documentActions = { onArchive };
  const handlers = useCommonHandlers({ modals, documentActions });

  const handleDownload = useCallback((documentName: string) => {
    handlers.handleDownloadClick(documentName);
  }, [handlers]);

  const handleVersionManagement = useCallback((documentName: string) => {
    if (modals.handleVersionHistoryClick) {
      modals.handleVersionHistoryClick(documentName);
    } else {
      handlers.handleVersionManagementClick(documentName);
    }
  }, [handlers, modals]);

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
      {isLoading ? (
        <LoadingContainer>
          <LoadingText>로딩 중...</LoadingText>
        </LoadingContainer>
      ) : items.length > 0 ? (
        <Table>
          <TableHead headers={headers} />
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.documentId}>
                <TableCell>
                  <DocumentName>{item.documentName}</DocumentName>
                </TableCell>
                <TableCell>
                  <CategoryImage src={categoryImage} alt={item.category} />
                </TableCell>
                <TableCell>
                  <VersionText>{item.latestVersion}</VersionText>
                </TableCell>
                <TableCell>
                  <AuthorText>{item.uploaderName}</AuthorText>
                </TableCell>
                <TableCell>
                  <DateText>{item.lastUpdatedAt}</DateText>
                </TableCell>
                <TableCell>
                  <StatusIcon src={item.isActive ? ActiveIcon : InActiveIcon} alt={item.isActive ? "활성" : "비활성"} />
                </TableCell>
                <TableCell>
                  <DropDownButton 
                    items={[
                      { label: "다운로드", onClick: () => handleDownload(item.documentName) },
                      { label: "버전관리", onClick: () => handleVersionManagement(item.documentName) },
                      { label: "보관", onClick: () => handleArchive(item.documentName) },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState />
      )}
    </TableContainer>
  );
};

export default CommonTable;

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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingText = styled.div`
  color: #666;
  font-size: 16px;
  font-weight: 500;
`;
