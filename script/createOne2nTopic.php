<?php
/** 2016-3-13
 * 从topic题库读取当堂知识点的自适应难度level练习题5个（不能与已有练习题重复），
 * 批量加入topic-teach表，加上学生报名字段
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;
// 题目按3个科目分3个表，题目对应知识点多个list zsd in(list)
$subjectID = $arr->subjectID;
$zsdID = $arr->zsdID; //转换：字符串(string) ???
$level = $arr->level;
$courseNo = addslashes($arr->courseNo);
	
if($subjectID==1){
	$table = 'sx_xiaochu_exam_question';
}elseif($subjectID==2){
	$table = 'wl_chu_exam_question';
}else{
	$table = 'hx_chu_exam_question';
} 
	
// 当前学生学习每次抓取5个不同的题目 not exist()
/*
$query = "SELECT * from `$table` 
	where $zsdID in(zsdID_list) and level=$level and
	NOT EXISTS
(select * from `ghjy_topic-teach` where 
	`$table`.gid=`ghjy_topic-teach`.gid and 
	`ghjy_topic-teach`.studentstudyID=$studentstudyID) 
	LIMIT 5 "; 
*/  
// 该学生的该知识点的已经练习题目不能再出现 not in
$query = "SELECT * FROM `$table`  
	Where find_in_set('$zsdID',zsdID_list) And level=$level And 
	gid Not in(Select gid From `ghjy_one2n_topic` Where courseNo='$courseNo') 
	LIMIT 5";  
/*
$query = "SELECT * FROM `$table` 
	Where '$zsdID' in(zsdID_list) And level=$level LIMIT 5"; 
*/	
$result = mysql_query($query) Or die("Invalid query: readTopicList" . mysql_error());

$query_array = array();
$i = 0;
while($row = mysql_fetch_array($result)) {
    //$topicID = $row["topicID"];
	$gid = $row["gid"];
	$query2 = "INSERT INTO `ghjy_one2n_topic`
		(courseNo,subjectID,zsdID,gid) 
		VALUES( '$courseNo', $subjectID,$zsdID,'$gid' )";
    $result2 = mysql_query($query2) Or die("Invalid query: createOne2nTopic teach" . mysql_error());		
	
	array_push($query_array,$row);
	$i++;
}
		
$res->success = true;
$res->message = "读取并创建当堂课教学练习题one2n topic-teach成功";
$res->data = $query_array;

echo $_GET['callback']."(".$res->to_json().")";

?>