<%
alert(Request.Form.course_path);

/*
*/

/*
Главная функция приложения - создаёт курс в WebTutor
@param String course_path - абсолютный путь к файлу курса, опубликованного системой adaptlearning
@return Bool - статус успешности выполнения модуля
*/
function main(course_path){
    var is_file_exists = FilePathExists(course_path);
    if (!is_file_exists) {
        alert("adaptTutor.Error.1: Передан некорректный путь к файлу");
        return false;
    }

    var unzipped_course_path = unzip_course(course_path);
}

main(Request.Form.course_path);
%>