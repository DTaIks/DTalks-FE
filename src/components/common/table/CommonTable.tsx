import React from "react";
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
  userRole?: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onArchive: (id: number, isArchived?: boolean) => void;
  onUpdate?: (documentName: string) => void;
  categoryImage: string;
  isLoading?: boolean;
  error?: {
    message: string;
    subMessage: string;
  } | null;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download' | 'restore', fileName: string) => void;
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
  userRole,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onArchive,
  onUpdate,
  categoryImage,
  isLoading = false,
  error = null,
  modals
}) => {
  const handlers = useCommonHandlers({ modals, documentActions: { onArchive, onUpdate } });

  const handleAction = (action: string, documentName: string, fileUrl?: string) => {
    switch (action) {
      case 'download':
        handlers.handleDownloadClick(documentName, fileUrl);
        break;
      case 'update':
        handlers.handleDocumentUpdateClick(documentName);
        break;
      case 'version':
        if (modals.handleVersionHistoryClick) {
          modals.handleVersionHistoryClick(documentName);
        } else {
          handlers.handleVersionManagementClick(documentName);
        }
        break;
      case 'archive': {
        // 파일명으로 문서를 찾아서 isActive 상태 확인
        const document = items.find(item => item.documentName === documentName);
        if (document) {
          onArchive(document.documentId, !document.isActive);
        }
        break;
      }
    }
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <LoadingContainer>
          <LoadingText>로딩 중...</LoadingText>
        </LoadingContainer>
      );
    }

    if (error) {
      return (
        <EmptyState 
          message={error.message}
          subMessage={error.subMessage}
        />
      );
    }

    if (items.length === 0) {
      return (
        <EmptyState 
          message={searchTerm ? "검색 결과가 없습니다." : "접근 권한이 없습니다."}
          subMessage={searchTerm ? "다른 검색어를 입력해보세요." : "권한을 확인해주세요."}
        />
      );
    }

    return (
      <Table>
        <TableHead headers={["문서명", "카테고리", "버전", "작성자", "최종 수정일", "상태", "작업"]} />
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.documentId}>
              <TableCell><Text>{item.documentName}</Text></TableCell>
              <TableCell><CategoryImage src={categoryImage} alt={item.category} /></TableCell>
              <TableCell><Text>{item.latestVersion}</Text></TableCell>
              <TableCell><Text>{item.uploaderName}</Text></TableCell>
              <TableCell><Text>{item.lastUpdatedAt}</Text></TableCell>
              <TableCell>
                <StatusIcon 
                  src={item.isActive ? ActiveIcon : InActiveIcon} 
                  alt={item.isActive ? "활성" : "비활성"} 
                />
              </TableCell>
                            <TableCell>
                <DropDownButton 
                  items={[
                    { label: "다운로드", onClick: () => handleAction('download', item.documentName, item.fileUrl) },
                    { label: "수정", onClick: () => handleAction('update', item.documentName) },
                    { label: "버전관리", onClick: () => handleAction('version', item.documentName) },
                    { 
                      label: item.isActive ? "보관" : "복원", 
                      onClick: () => handleAction('archive', item.documentName),
                      disabled: !item.isActive && userRole === '편집자' // 비활성 상태이고 편집자인 경우 복원 버튼 비활성화
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

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
      {renderTableContent()}
    </TableContainer>
  );
};

export default CommonTable;

const Table = styled.div`
  width: 100%;
`;

const Text = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
`;

const CategoryImage = styled.img`
  width: 97.5px;
  height: 31.5px;
  object-fit: contain;
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