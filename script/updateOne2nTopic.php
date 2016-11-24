<?php
/*log
*16-03-09 教学做题评分 0 1 2 3
endlog */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;
$done = $arr->done;
$one2ntopicID = $arr->one2ntopicID;

$query = "UPDATE `ghjy_topic-teach` SET done = '$done' 
	WHERE one2ntopicID = $one2ntopicID ";
$result = mysql_query($query) 
	or die("Invalid query: updateOne2nTopic By done " . mysql_error());
$res->success = true;
$res->message = "教学题目topic";
$res->data = array();
	
echo $_GET['callback']."(".$res->to_json().")";

?>
