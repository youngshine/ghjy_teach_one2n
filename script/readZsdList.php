<?php
// 读取某个年级学科下的知识点
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$subjectID = $arr->subjectID;
$gradeID = $arr->gradeID;
	
$query = "SELECT * From `ghjy_zsd` a 
	Where subjectID = $subjectID And gradeID=$gradeID ";
    
$result = mysql_query($query) Or die("Invalid query: readZsdList" . mysql_error());

$query_array = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	array_push($query_array,$row);
	$i++;
}
	
$res->success = true;
$res->message = "读取某个年级学科知识点zsd成功";
$res->data = $query_array;

echo $_GET['callback']."(".$res->to_json().")";

?>