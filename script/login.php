<?php 

require_once('db/request.php');
require_once('db/response.php');
require_once('db/database_connection.php');
//require_once ('../lib/global_function.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$username = addslashes($arr->username);
$psw = addslashes($arr->psw);
$school = addslashes($arr->school);

$query = "SELECT a.teacherID,a.teacherName,b.schoolName 
	From `ghjy_teacher` a 
    Join `ghjy_school` b On a.schoolID=b.schoolID  
	Where a.teacherName = '$username' And a.psw = '$psw' And b.schoolName='$school' ";
	
$result = mysql_query($query);

if(mysql_num_rows($result)>0){
	$row = mysql_fetch_assoc($result); 
	$res->success = true;
	$res->message = '教师登录成功';
	//$res->total = 1;
	$res->data = $row;
}else{
	$res->success = false;
	$res->message = "登录信息错误";
	$res->data = array();
}

echo $_GET['callback']."(".$res->to_json().")";

?>