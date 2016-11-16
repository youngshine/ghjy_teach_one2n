<?php
/*
  * oop方式 class , + ajax json跨域（不用jsonp)
  * 读取某个学校的分校区 至少都有一个if any,
*/

// 不定参数，用数组？？
$schoolID = $_REQUEST['schoolID'];

$schoolsub = new Schoolsub($schoolID);
$res = $schoolsub->getList();

echo json_encode(array(
    "success" => true,
    "message" => "成功",
	"data" => $res,
));

class Schoolsub {
  //private $schoolsubID;
  private $schoolID;
  
  //private $query_result; //查询结果集

  public function __construct($schoolID) {
	  //$this->schoolsubID = $schoolsubID;
	  $this->schoolID = $schoolID;
  }
	
  public function getList() {	  
	  // require_once('db_cfg.php');
	  mysql_query("SET NAMES utf8");
	  date_default_timezone_set("Asia/Shanghai");
	  
	  //$con = mysql_connect("w.rdc.sae.sina.com.cn","SAE_MYSQL_USER","SAE_MYSQL_PASS");
	  $ip = '10.66.153.50:3306';
	  $user = 'root';
	  $psw = 'rootroot2@';
	  $conn = mysql_connect($ip,$user,$psw);
	  // 新浪云mysql
	  //$conn = mysql_connect(SAE_MYSQL_HOST_M.":".SAE_MYSQL_PORT,SAE_MYSQL_USER,SAE_MYSQL_PASS);
	  if (!$conn) die('Could not connect: ' . mysql_error());

	  mysql_select_db("ghjy", $conn);	 
	  
	  $query = "SELECT a.*,b.schoolName  
		  From `ghjy_school_sub` a 
		  Join `ghjy_school` b On a.schoolID=b.schoolID  
		  Where a.schoolID=$this->schoolID ";  
	  $result = mysql_query($query,$conn);
	  
	  mysql_close($conn); 
	  //$this->query_result = mysql_fetch_array($result); //单个记录
	  
		$query_array = array();
		$i = 0;
		//Iterate all Select
		while($row = mysql_fetch_array($result))
		{
			array_push($query_array,$row);
			$i++;
		}
		
		//$this->query_result = $query_array;  
	  return $query_array;
  }
}
	
?>