<?php
// 一对多某个课时courseNo的练习题集
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

// 题目按3个科目分3个表，题目对应知识点多个list zsd in(list)
$subjectID = $arr->subjectID;
$courseNo = $arr->courseNo;

if($subjectID==1){
	$table = 'sx_xiaochu_exam_question';
}elseif($subjectID==2){
	$table = 'wl_chu_exam_question';
}else{
	$table = 'hx_chu_exam_question';
} 

// 不合适的练习题current=0
$query = " SELECT a.*,b.content,b.answer,b.objective_answer,b.level,c.zsdName   
	From `ghjy_one2n_topic` a 
	Join `$table` b On a.gid=b.gid 
	Join `ghjy_zsd` c On (a.zsdID=c.zsdID And a.subjectID=c.subjectID)  
	Where a.courseNo = '$courseNo' And a.current=1 
	Order by a.created Desc ";

$result = mysql_query($query) 
	or die("Invalid query: readTopicByCourse" . mysql_error());

$query_array = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	array_push($query_array,$row);
	$i++;
}
	
$res->success = true;
$res->message = "读取当堂课教学练习题topic成功";
$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";

?>