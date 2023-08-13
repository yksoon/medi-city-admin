#!/bin/sh

## 파라미터가 없으면 종료 
if [ "$#" -lt 1 ]; then
    echo "$# is Illegal number of parameters."
    echo "Usage: $0 repository git-action dir-name branch-name"
	exit 1
fi
args=("$@")


gitRepository=""
gitAction=""
dirName=""
branchName=""

echo "-------------------------------------------- PARAMETERS CHECK START --------------------------------------"
## for loop 를 파라미터 갯수만큼 돌리기 위해 three-parameter loop control 사용
for (( c=0; c<$#; c++ ))
do
	if [ "$c" == 0 ]; then
		gitRepository=${args[$c]}
	fi 

	if [ "$c" == 1 ]; then
		gitAction=${args[$c]}
	fi

	if [ "$c" == 2 ]; then
                dirName=${args[$c]}
        fi

	if [ "$c" == 3 ]; then
		branchName=${args[$c]}
	fi


	echo "$c th parameter = ${args[$c]}"
done
echo "----------------------------------------- PARAMETERS CHECK END -------------------------------------"
echo ""
echo ""
echo "-------------------------------------- GIT SYNC START ---------------------------------------------"
#echo "gitRepository : $gitRepository, gitAction : $gitAction, dirName : $dirName, branchName : $branchName"

medicityToken="glpat-vLYxMsY53r1F53skEEDE"
hicompToken="glpat-HxrLq4nRVh3aippwpRx6"

gitProtocol="https://oauth:"
gitPublicUrl="dist.hicompint.com"
gitUrl=""

targetDir="/home/hicomp/"
subDirName=""
targetSubDir=""
if [ -z $dirName ]; then
	subDirName="/hicomp/external/"
	gitUrl="$gitProtocol$hicompToken@$gitPublicUrl$subDirName$gitRepository.git"
	targetSubDir="$targetDir$gitRepository"
else
	if [ "$dirName" == "jobara" ]; then
		subDirName="/hicomp/external/$dirName/"
		gitUrl="$gitProtocol$hicompToken@$gitPublicUrl$subDirName$gitRepository.git"

		if [ "$gitRepository" == "front-end" ]; then
			targetSubDir="/home/hicomp/jobara-front"
		else
			targetSubDir="/home/hicomp/jobara-back"
		fi
	else
		subDirName="medi-city/kmedi"
		if [ "$gitRepository" == "test-web" ] || [ "$gitRepository" == "dev-web" ]; then
			gitUrl="$gitProtocol$medicityToken@$gitPublicUrl/$subDirName/client.git"
		else 
			gitUrl="$gitProtocol$medicityToken@$gitPublicUrl/$subDirName/admin-client.git"
		fi
		targetSubDir="$targetDir$subDirName/$gitRepository"
	fi	
fi

echo "gitUrl : $gitUrl" 
echo "targetSubDir : $targetSubDir"

if [ -z $branchName ]; then
        branchName="main"
fi

gitCli=""
if [ ! -d $targetSubDir ]; then
	mkdir -p $targetSubDir
	cd $targetSubDir
	gitCli="clone"
	git clone $gitUrl $targetSubDir
else 
	cd $targetSubDir
	gitCli="pull"
	git fetch --all
        git reset --hard origin/$branchName
	git pull $gitUrl $branchName
fi	

echo "gitCli : $gitCli($branchName)"
lastCommitHash=`git log -1 --format="%H"`
echo "---------------------------- COMMIT MESSEGE -------------------------------"
echo "lastCommitHash : `git log -1 --pretty=format:"%h - %an, %ar : %s"`"
echo "---------------------------- COMMIT MESSEGE -------------------------------"
echo ""
echo "-------------------------------------- GIT SYNC END ---------------------------------------------"
echo ""
echo ""
echo "-------------------------------------- JENKINS WORKSPACE START ----------------------------------"

jenkinsWorkspace="/home/jenkins-data/workspace/"
jenkinsTargetDir=""

#if [ -z $dirName ]; then
#	jenkinsTargetDir="$jenkinsWorkspace$gitRepository/"
#else
#        if [ "$dirName" == "jobara" ]; then
#		jenkinsTargetDir="$jenkinsWorkspace$dirName/$gitRepository/"
#        else
#		jenkinsWorkspace="/home/jenkins-data/workspace"
#		jenkinsTargetDir="$jenkinsWorkspace/medi-city/kmedi/$gitRepository/"
#        fi
#fi

if [ "$dirName" == "jobara" ]; then
	if [ "$gitRepository" == "front-end" ]; then
		jenkinsTargetDir="/home/jenkins-data/workspace/jobara-front/"
        else
        	jenkinsTargetDir="/home/jenkins-data/workspace/jobara-back/"
        fi
else
	jenkinsTargetDir="$jenkinsWorkspace$gitRepository/"
fi

#jenkinsTargetDir="$jenkinsWorkspace$gitRepository/"

if [ ! -d $jenkinsTargetDir ]; then
	echo "make dir..."
	mkdir -p $jenkinsTargetDir
fi

echo "jenkinsTargetDir : $jenkinsTargetDir"
echo "current path : `pwd`"

if [ "$dirName" == "jobara" ]; then
        if [ "$gitRepository" == "back-end" ]; then
		echo "git sync dir : `ls -al /home/hicomp/jobara-back`"
		cp -rf /home/hicomp/jobara-back/* /home/jenkins-data/workspace/jobara-back
		echo "copying..."
		echo "jenkins workspace dir : `ls -l /home/jenkins-data/workspace/jobara-back/jobara-service`"
        else
		echo "git sync dir : `ls -al /home/hicomp/jobara-front`"
                cp -rf /home/hicomp/jobara-font/* /home/jenkins-data/workspace/jobara-front
                echo "copying..."
		rm -rf /home/jenkins-data/workspace/jobara-front/web_src
		echo "web_src remove..."
                echo "jenkins workspace dir : `ls -l /home/jenkins-data/workspace/jobara-front`"

        fi
else
	#git diff -name-only $lastCommitHash HEAD > gitUpdateFileList.txt
        #git diff-tree -r --no-commit-id --name-only $lastCommitHash HEAD | xargs tar -rf $gitRepository.tar

        if [ "$dirName" == "jobara" ]; then
                git archive --format=tar.gz HEAD -o $jenkinsTargetDir.tar.gz $(git diff --name-only HEAD^)
        else
                git archive --format=tar.gz HEAD -o $jenkinsTargetDir$gitRepository.tar.gz $(git diff --name-only HEAD^)
        fi
        echo "git archive..."

        #mv -f `git diff --name-only HEAD~1` $jenkinsTargetDir
        #mv -f $gitRepository.tar $jenkinsTargetDir

        cd $jenkinsTargetDir
        chown -R jenkins:jenkins $jenkinsWorkspace

        if [ "$dirName" == "jobara" ]; then
                tar -zxvf $jenkinsTargetDir.tar.gz
                rm -rf $jenkinsTargetDir.tar.gz
        else
                tar -zxvf $jenkinsTargetDir$gitRepository.tar.gz
                rm -rf $jenkinsTargetDir$gitRepository.tar.gz
        fi

        echo ">>>>>"$jenkinsTargetDir
        ls -l $jenkinsTargetDir

fi
echo "-------------------------------------- JENKINS WORKSPACE END ----------------------------------"
echo ""
echo ""
