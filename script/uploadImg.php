<?php

/**  
  * 上传图片＋插入数据库  
  *  图片保存云存储cos，而不是硬盘文件
  */
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

//include_once('saestorage.class.php'); //新浪云平台存储组件API
require_once('db/database_connection.php');

if( isset( $_REQUEST['do']) ){
    //var_dump($_FILES['fileToUpload']);
	
	$file = $_FILES['fileToUpload'];
    $fileName = $file['name'];
    $fileSize = $file['size'];
	$tmpName = $_FILES['fileToUpload']['tmp_name'];
    //$name = $_FILES['fileToUpload']['name']; 
    //$basename = pathinfo($name,PATHINFO_EXTENSION); 

	//$newName = date('ymdhis')."_".rand(100,999) . ".jpg";
	
	// 1、物理文件上传 X
	//$result = move_uploaded_file($_FILES['fileToUpload']['tmp_name'], "img/" . $newName );
	// 1.1 上传cos 18-9-8
	// 配置项 start
	$appid = '10060757'; //腾讯云存储，cos
	$bucket_name = 'teach1to1'; //教师pad上传学习笔记
	$dir_name = 'studyphoto';
	$secretID = 'AKIDFSOllkXzLQBQASDQU6h6w3ktA4Rxl99D';
	$secretKey = 'heUXG8vvkmpIr5vskbAYC6qp2fCBuOVW';
	// 配置项 end
	// 需要存储的资源url, 这里用百度logo来做演示
	$pic_url = $fileName;
	//$pic_url = 'http://www.baidu.com/img/logo.gif';
	// 获取文件名
	$filename = end(explode('/', $pic_url));
	$filename = date('ymdhis')."_".rand(100,999) . ".jpg";
	// 构造上传url
	$upload_url = "web.file.myqcloud.com/files/v1/$appid/$bucket_name/$dir_name/$filename";
	// 设置过期时间
	$exp = time() + 3600;
	// 构造鉴权key
	$sign = "a=$appid&b=$bucket_name&k=$secretID&e=$exp&t=" . time() . '&r=' . rand() . "&f=/$appid/$bucket_name/$dir_name/$filename";
	$sign = base64_encode(hash_hmac('SHA1', $sign, $secretKey, true) . $sign);
	// 构造post数据
	$post_data = array(
	    'op' => 'upload',
		'filecontent' => file_get_contents($tmpName) // 上传的真正文件
	    //'filecontent' => file_get_contents($pic_url),  // baidu logo
	);
	
	var_dump( $post_data );
	
	// 设置post的headers, 加入鉴权key
	$header = array(
	    'Content-Type: multipart/form-data',
	    'Authorization: ' . $sign,
	);

	$ch = curl_init($upload_url);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
	$res = curl_exec($ch);
	curl_close($ch);
	$res = json_decode($res, true);
	if (isset($res['data']['access_url'])) {
	    // 成功, 输出文件url
	    //echo $res['data']['access_url'];
		//return $res['data']['access_url'];
		//echo json_encode($res); exit();

		$fullName = $res['data']['access_url'];
		//createStudyphoto($fullName);
		
	    $studentstudyID = $_REQUEST['studentstudyID'];
		/// 旧的 $fullName = 'script/img/' . $newName; // 图片文件路径
	    $sql = "INSERT INTO `ghjy_student-study-photos` (photo,studentstudyID) 
	    	VALUES('$fullName',$studentstudyID)"; 
	    $result = mysql_query($sql) 
	        or die("Invalid query: uploadPhoto cos & insert" . mysql_error());
       
	    //die();
		// 返回最新插入记录id
		$id = mysql_insert_id();  

		// 返回当前插入记录
		echo json_encode(array(
			"studyphotoID" => $id,
			"photo" => $fullName,//$newName,
			"studentstudyID" => $studentstudyID,
			//"created": date('ymdhis') //跨域问题
		));	
	} else {
	    // 失败
	    echo $res;
		//return $res;
		//echo json_encode($res); exit();	
	}

	
    //echo $s = $stor->upload("imgfile",$newName,$tmp_name); 
    // $stor->getUrl //获取文件storage访问地址
    //$file_url = $stor->getUrl("domain","cdn_test.txt");
    //$file_url = $stor->getUrl("imgfile",$newName);

    // 2、插入数据库
	function createStudyphoto($fullName){
	    //$today = date('ymd');
	    //$title = addslashes($_REQUEST['title']);
	    $studentstudyID = $_REQUEST['studentstudyID'];
		/// 旧的 $fullName = 'script/img/' . $newName; // 图片文件路径
	    $sql = "INSERT INTO `ghjy_student-study-photos` (photo,studentstudyID) 
	    	VALUES('$fullName',$studentstudyID)"; 
	    $result = mysql_query($sql) 
	        or die("Invalid query: uploadPhoto cos & insert" . mysql_error());
       
	    //die();
		// 返回最新插入记录id
		$id = mysql_insert_id();  

		// 返回当前插入记录
		echo json_encode(array(
			"studyphotoID" => $id,
			"photo" => $fullName,//$newName,
			"studentstudyID" => $studentstudyID,
			//"created": date('ymdhis') //跨域问题
		));	
	};
}

?>