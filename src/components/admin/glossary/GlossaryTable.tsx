import React, { useCallback, useState } from "react";
import CommonTable from "@/components/common/table/CommonTable";
import DocumentCategory3 from "@/assets/document/DocumentCategory3.svg";
import type { DocumentResponse } from "@/types/document";

interface GlossaryTableProps {
  glossaryData?: DocumentResponse;
  isLoading: boolean;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
    handleVersionHistoryClick?: (fileName: string) => void;
  };
}

const GlossaryTable: React.FC<GlossaryTableProps> = ({ 
  glossaryData,
  isLoading,
  modals
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체 상태");

  // API 데이터에서 문서 목록 추출
  const documentList = glossaryData?.documentInfoResponseList || [];

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
  }, []);

  const handleArchive = useCallback((id: number) => {
    // 보관 처리 로직 (API 호출 필요)
    console.log('보관 처리:', id);
  }, []);

  return (
    <CommonTable
      title="용어사전 목록"
      items={documentList}
      searchTerm={searchTerm}
      selectedStatus={selectedStatus}
      onSearchChange={handleSearch}
      onStatusChange={handleStatusChange}
      onArchive={handleArchive}
      categoryImage={DocumentCategory3}
      modals={modals}
      isLoading={isLoading}
    />
  );
};

export default GlossaryTable;
