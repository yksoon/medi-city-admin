#!/bin/sh

## 파라미터가 없으면 종료
if [ "$#" -lt 1 ]; then
    echo "$# is Illegal number of parameters."
    echo "Usage: $0 repository git-action dir-name branch-name"
        exit 1
fi
args=("$@")


dirName=""
gitRepository=""

echo ""
echo "-------------------------------------------- JENKINS WORKSPACE CLEAN START --------------------------------------"
## for loop 를 파라미터 갯수만큼 돌리기 위해 three-parameter loop control 사용
for (( c=0; c<$#; c++ ))
do
	if [ "$c" == 0 ]; then
                gitRepository=${args[$c]}
        fi

        if [ "$c" == 1 ]; then
                dirName=${args[$c]}
        fi

        echo "$c th parameter = ${args[$c]}"
done
jenkinsWorkspace="/home/jenkins-data/workspace"
jenkinsTargetDir=""

#if [ -z $dirName ]; then
#        jenkinsTargetDir="$jenkinsWorkspace/$gitRepository"
#else
#        if [ "$dirName" == "jobara" ]; then
#                jenkinsTargetDir="$jenkinsWorkspace/$dirName/$gitRepository"
#        else
#                jenkinsTargetDir="$jenkinsWorkspace/medi-city/kmedi/$gitRepository"
#        fi
#fi
#jenkinsTargetDir="$jenkinsWorkspace/$gitRepository"

if [ "$dirName" == "jobara" ]; then
        if [ "$gitRepository" == "front-end" ]; then
                jenkinsTargetDir="/home/jenkins-data/workspace/jobara-front/"
        else
                jenkinsTargetDir="/home/jenkins-data/workspace/jobara-back/"
        fi
else
        jenkinsTargetDir="$jenkinsWorkspace$gitRepository/"
fi

echo "jenkinsTargetDir : $jenkinsTargetDir"

rm -rf $jenkinsTargetDir

echo "----------------------------------------- JENKINS WORKSPACE CLEAN END -------------------------------------"
echo ""
