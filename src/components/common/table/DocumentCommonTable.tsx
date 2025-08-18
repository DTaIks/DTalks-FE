import React from "react";
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
  onArchive: (id: number, isArchived?: boolean) => void;
  onUpdate?: (documentName: string) => void;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download' | 'restore', fileName: string) => void;
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
  onUpdate,
  modals,
  error = null
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
        handlers.handleVersionManagementClick(documentName);
        break;
      case 'archive': {
        // 파일명으로 문서를 찾아서 isActive 상태 확인
        const document = documents.find(doc => doc.documentName === documentName);
        if (document) {
          onArchive(document.documentId, !document.isActive);
        }
        break;
      }
    }
  };

  const getCategoryImage = (category: string) => {
    switch (category) {
      case "POLICY":
      case "policy":
        return DocumentCategory2; // 사내정책
      case "TERMINOLOGY":
      case "terminology":
      case "glossary":
        return DocumentCategory3; // 용어사전
      case "REPORT_FORM":
      case "report_form":
      case "reportform":
        return DocumentCategory1; // 보고서양식
      default:
        return DocumentCategory1; // Default to 보고서양식
    }
  };

  // 에러 메시지 결정
  const getErrorMessage = () => {
    if (!error) return '';
    
    // 403 권한 오류인지 확인
    const isPermissionError = error.message?.includes('403') || 
                             error.message?.includes('권한') ||
                             error.message?.includes('접근') ||
                             (error as { response?: { status?: number } })?.response?.status === 403;
    
    if (isPermissionError) {
      return '접근 권한이 없습니다.';
    }
    
    return '문서를 불러오는데 실패했습니다.';
  };

  // 에러 서브메시지 결정
  const getErrorSubMessage = () => {
    if (!error) return '';
    
    const isPermissionError = error.message?.includes('403') || 
                             error.message?.includes('권한') ||
                             error.message?.includes('접근') ||
                             (error as { response?: { status?: number } })?.response?.status === 403;
    
    if (isPermissionError) {
      return '관리자에게 문의해주세요.';
    }
    
    return '잠시 후 다시 시도해주세요.';
  };

  const renderTableContent = () => {
    if (error) {
      return (
        <EmptyState 
          message={getErrorMessage()}
          subMessage={getErrorSubMessage()}
        />
      );
    }

    if (documents.length === 0) {
      return (
        <EmptyState 
          message="표시할 문서가 없습니다"
          subMessage="업로드된 문서가 없거나 필터 조건에 맞는 문서가 없습니다."
        />
      );
    }

    return (
      <Table>
        <TableHead headers={["문서명", "카테고리", "버전", "작성자", "최종 수정일", "상태", "작업"]} />
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.documentId}>
              <TableCell><Text>{document.documentName}</Text></TableCell>
              <TableCell>
                <CategoryImage src={getCategoryImage(document.category)} alt={document.category} />
              </TableCell>
              <TableCell><Text>{document.latestVersion}</Text></TableCell>
              <TableCell><Text>{document.uploaderName}</Text></TableCell>
              <TableCell><Text>{document.lastUpdatedAt}</Text></TableCell>
              <TableCell>
                <StatusIcon 
                  src={document.isActive ? ActiveIcon : InActiveIcon} 
                  alt={document.isActive ? "활성" : "비활성"} 
                />
              </TableCell>
              <TableCell>
                <DropDownButton 
                  items={[
                    { label: "다운로드", onClick: () => handleAction('download', document.documentName, document.fileUrl) },
                    { label: "수정", onClick: () => handleAction('update', document.documentName) },
                    { label: "버전관리", onClick: () => handleAction('version', document.documentName) },
                                         { label: document.isActive ? "보관" : "복원", onClick: () => handleAction('archive', document.documentName) },
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

export default DocumentTable;

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