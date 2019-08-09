/**
* Функция распаковывает архив курса в папку курсов WebTutor
* @param String zip_path - путь к архиву курса
* @return String - путь к каталогу с разархивированным курсом
*/
function unzip_course(course_path){
    var new_path = "x-local://wt/web/webtutor/"+String(DateToRawSeconds(Date()));
    try{
        ZipExtract(course_path, new_path);
        return new_path;
    }catch(e){
        alert("adaptTutorLib. Ошибка 1. Ошибка при распаковке архива с курсом");
        return "";
    }    
}

/**
 * Возвращает уникальный код, присвоенный adaptlearning курсу. 
 * @param String course_path - путь к каталогу курса
 * @return String - код курса
 */
function get_code_from_path(course_path){    
    if(StrMatchesPattern(course_path, '*\download.zip')){       
        var new_path = StrReplace(course_path, '\\download.zip', '');
        var path_length = StrLen(new_path);
        var result = "";
        for (var i = path_length; i = 1; i--){
            if(StrCharRangePos(new_path, i, 1) == '\\'){
                return SrtRightRangePos(new_path, i+1);
            }
        }        
    }else{
        return '';
    }
    
}


/**
 * Получает из файла манифеста данные, необходимые для формирования модуля
 * @param Strind manifest_path - путь к файлу манифеста
 * @return Bool - флаг об успешности выполнения операции
 * TODO
 */
function get_module_data(manifest_path){
    return false
}


/**
* Создаёт карточку модуля курса
* @param String course_path - путь к каталогу курса в WebTutor
* @return Doc - документ модуля курса
* TODO
*/
function create_module(course_path){
    //return OpenNewDoc('x-local://wtv/wtv_course_module.xmd');
    var manifest_path = course_path + "\\imsmanifest.xml";
    var module_data = get_module_data(manifest_path);

}

/**
* Создаёт карточку курса
* @param Doc module - документ модуля курса
* @return Doc course - документ курса
* TODO
*/
function create_course(module){
    return OpenNewDoc('x-local://wtv/wtv_course.xmd');
}
