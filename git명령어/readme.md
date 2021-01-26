* 이미 쓰이고 커밋한 파일 이그노어 할때
    * git rm -r --cached 폴더명
* 실수한 커밋 삭제
    * git reset HEAD~숫자
        * 최근 커밋한 숫자의 갯수만큼 커밋을 지워줌
    * git push -f origin "브랜치 명"
        * 깃헙에도 반영