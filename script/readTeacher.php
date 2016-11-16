<?php
// 读取一对多教师的预设课程表
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$teacherID = $arr->teacherID;
	
$query = "SELECT * From `ghjy_teacher` Where teacherID=$teacherID ";
		
$result = mysql_query($query) Or die("Invalid query: readTeacher" . mysql_error());

$row = mysql_fetch_array($result) or die("Invalid query: row" . mysql_error());
	
$res->success = true;
$res->message = "读取某个教师的一对多课程timely_list成功";
$res->data = $row;

echo $_GET['callback']."(".$res->to_json().")";

?>