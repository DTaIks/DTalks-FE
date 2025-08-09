import React, { useState } from 'react';
import styled from 'styled-components';

interface DocumentInfo {
  documentName: string;
  description?: string;
  lastModified?: string;
}

interface DocumentSearchProps {
  searchValue: string;
  documentSuggestions: DocumentInfo[];
  isLoadingDocuments: boolean;
  onSearchChange: (value: string) => void;
  onDocumentSelect: (documentName: string) => void;
  selectedDocument: string;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({
  searchValue,
  documentSuggestions,
  onSearchChange,
  onDocumentSelect,
  selectedDocument
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setShowSuggestions(value.length > 0 && !selectedDocument);
  };

  const handleDocumentSelect = (documentName: string) => {
    onDocumentSelect(documentName);
    setShowSuggestions(false);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSearchFocus = () => {
    if (searchValue && !selectedDocument && documentSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <SearchContainer>
      <SearchInputContainer>
        <InputBox 
          placeholder="문서명을 입력하여 검색하세요"
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
        
        {showSuggestions && documentSuggestions.length > 0 && (
          <SuggestionsDropdown>
            {documentSuggestions.map((doc, index) => (
              <SuggestionItem 
                key={index}
                onClick={() => handleDocumentSelect(doc.documentName)}
              >
                <DocumentName>{doc.documentName}</DocumentName>
              </SuggestionItem>
            ))}
          </SuggestionsDropdown>
        )}
      </SearchInputContainer>
    </SearchContainer>
  );
};

export default DocumentSearch;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const SearchInputContainer = styled.div`
  position: relative;
  width: 576px;
`;

const InputBox = styled.input`
  width: 100%; 
  height: 34px;
  border: 1px solid #CCC;
  border-radius: 4px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box; 
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    border-color: #9966CC;
    box-shadow: 0 0 0 2px rgba(153, 102, 204, 0.1);
  }
`;

const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #E5E5E5;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
`;

const SuggestionItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #F5F5F5;
  
  &:hover {
    background-color: #F8F2FB;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const DocumentName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;
