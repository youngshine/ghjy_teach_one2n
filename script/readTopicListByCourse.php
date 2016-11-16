<?php
// 一对多某个课时courseNo的练习题集
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$courseNo = $arr->courseNo;

$query = " SELECT * From `ghjy_one2n_topic` 
	Where courseNo = '$courseNo' ";

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