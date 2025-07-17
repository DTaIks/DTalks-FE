import re
import sys
import os
import json

def get_branch_type(label_names, title):
    # 라벨/제목 타입 매핑
    type_map = {
        # 라벨 매핑
        '✨ feature': 'feat',
        'feature': 'feat',
        'feat': 'feat',

        '🐛 bug': 'fix',
        'bug': 'fix',
        'fix': 'fix',

        '♻️ refactor': 'refactor',
        'refactor': 'refactor',
        'refactoring': 'refactor',

        '🔥 remove': 'chore',
        'remove': 'chore',
        '🔧 config': 'chore',
        'config': 'chore',
        '✅ test': 'chore',
        'test': 'chore',
        '🚀 deploy': 'chore',
        'deploy': 'chore',
        'chore': 'chore',
    }
    
    # 1. 라벨에서 타입 추출
    for label in label_names:
        t = type_map.get(label)
        if t:
            return t
    
    # 2. 제목에서 [TYPE] 추출
    m = re.match(r'^\[([^\]]+)\]', title)
    if m:
        t = type_map.get(m.group(1).lower())
        if t:
            return t
    return 'issue'

def clean_title(title):
    # [TYPE] 제거
    title = re.sub(r'^\[[^\]]*\]\s*', '', title)
    # 공백 -> 하이픈, 특수문자 제거, 소문자 변환
    title = re.sub(r'\s+', '-', title)
    title = re.sub(r'[^\w\-\uac00-\ud7a3]', '', title)
    title = re.sub(r'-+', '-', title).strip('-').lower()
    return title or 'untitled'

if __name__ == "__main__":
    title = os.environ.get('ISSUE_TITLE', '')
    number = os.environ.get('ISSUE_NUMBER', '')
    labels_json = os.environ.get('ISSUE_LABELS', '[]')
    try:
        labels = json.loads(labels_json)
        label_names = [label.get('name', '').lower() for label in labels]
    except Exception:
        label_names = []

    branch_type = get_branch_type(label_names, title)
    clean = clean_title(title)
    branch_name = f"{number}_{branch_type}/{clean}"
    print(branch_name) 
