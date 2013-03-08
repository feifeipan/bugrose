var fso, tf;
var ForReading = 1; 
fso = new ActiveXObject("Scripting.FileSystemObject");
ts = fso.OpenTextFile("d:\\test\\x.txt", ForReading);
// 读取文件一行内容到字符串
s = ts.ReadAll(); 
// 创建新文件
tf = fso.CreateTextFile("d:\\test\\testfile.txt", true);

// 填写数据，并增加换行符
tf.Write(s) ;
// 增加3个空行
// tf.WriteBlankLines(3) ;
// 填写一行，不带换行符
// tf.Write ("This is a test.");
// 关闭文件
tf.Close();


