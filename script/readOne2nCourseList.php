<?php
// 读取一对N教师授课的课时表one2ncourse，微信点名、尚未下课的
// 新题目库，知识点分3个表，在数据库后端合并成zsd，索引subjectID+zsdID唯一
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$teacherID = $arr->teacherID;

$query = "SELECT a.*,b.title AS kcTitle,b.subjectID,c.subjectName         
	From `ghjy_one2n_course` a 
	JOIN `ghjy_kclist` b On a.kclistID=b.kclistID  
	Join `ghjy_subject` c On b.subjectID=c.subjectID 
	Where a.teacherID = $teacherID And a.hour = 0   
	Group By a.courseNo Order By a.created Desc";
		
$result = mysql_query($query)or die("Invalid query: readOne2nCourseList" . mysql_error());

$query_array = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	array_push($query_array,$row);
	$i++;
}
	
$res->success = true;
$res->message = "读取一对N上课课时列表one2n_course成功";
$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>